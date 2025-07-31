import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHash } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateMeetingRequest {
  bookingId: string;
  action: 'create' | 'join' | 'end';
  userRole: 'moderator' | 'attendee';
  userName?: string;
}

const BBB_SERVER_URL = Deno.env.get('BBB_SERVER_URL') || 'https://demo.bigbluebutton.org/bigbluebutton/api/';
const BBB_SECRET = Deno.env.get('BBB_SECRET') || 'bbb-none';

function generateChecksum(callName: string, queryString: string): string {
  const data = callName + queryString + BBB_SECRET;
  return createHash('sha1').update(data).digest('hex');
}

function buildBBBUrl(callName: string, params: Record<string, string>): string {
  const queryString = new URLSearchParams(params).toString();
  const checksum = generateChecksum(callName, queryString);
  return `${BBB_SERVER_URL}${callName}?${queryString}&checksum=${checksum}`;
}

async function callBBBApi(callName: string, params: Record<string, string>) {
  const url = buildBBBUrl(callName, params);
  console.log(`Calling BBB API: ${callName}`);
  
  try {
    const response = await fetch(url);
    const text = await response.text();
    console.log(`BBB API Response: ${text}`);
    return text;
  } catch (error) {
    console.error(`BBB API Error:`, error);
    throw error;
  }
}

async function createMeeting(booking: any) {
  const meetingParams = {
    name: `${booking.subject} Session - ${booking.tutor_name}`,
    meetingID: `booking-${booking.id}`,
    attendeePW: 'student123',
    moderatorPW: 'tutor123',
    welcome: `Welcome to your ${booking.subject} session! Your tutor will be with you shortly.`,
    dialNumber: '',
    voiceBridge: '',
    maxParticipants: '25',
    logoutURL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/bigbluebutton-meeting`,
    record: 'true',
    duration: '120',
    isBreakout: 'false',
    moderatorOnlyMessage: 'Welcome! You can start screen sharing and use the whiteboard.',
    autoStartRecording: 'false',
    allowStartStopRecording: 'true',
    webcamsOnlyForModerator: 'false',
    logo: '',
    bannerText: '',
    bannerColor: '#FFFFFF',
    copyright: '',
    muteOnStart: 'false',
    allowModsToUnmuteUsers: 'true',
    lockSettingsDisableCam: 'false',
    lockSettingsDisableMic: 'false',
    lockSettingsDisablePrivateChat: 'false',
    lockSettingsDisablePublicChat: 'false',
    lockSettingsDisableNote: 'false',
    lockSettingsLockOnJoin: 'false',
    lockSettingsLockOnJoinConfigurable: 'false',
    lockSettingsHideViewersCursor: 'false',
    guestPolicy: 'ALWAYS_ACCEPT'
  };

  return await callBBBApi('create', meetingParams);
}

async function generateJoinUrl(meetingID: string, userName: string, role: 'moderator' | 'attendee') {
  const password = role === 'moderator' ? 'tutor123' : 'student123';
  
  const joinParams = {
    fullName: userName,
    meetingID: meetingID,
    password: password,
    redirect: 'true',
    joinViaHtml5: 'true',
    createTime: Date.now().toString()
  };

  const url = buildBBBUrl('join', joinParams);
  return url;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { bookingId, action, userRole, userName }: CreateMeetingRequest = await req.json();

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select(`
        *,
        student_profile:profiles!bookings_student_id_fkey(first_name, last_name),
        tutor_profile:profiles!bookings_tutor_id_fkey(first_name, last_name)
      `)
      .eq('id', bookingId)
      .eq('payment_status', 'paid')
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found or not paid');
    }

    // Check if user is authorized (student or tutor of this booking)
    if (user.id !== booking.student_id && user.id !== booking.tutor_id) {
      throw new Error('Not authorized for this session');
    }

    const meetingID = `booking-${booking.id}`;
    
    if (action === 'create') {
      // Create the meeting
      const createResponse = await createMeeting(booking);
      
      // Store meeting info in database
      const { error: meetingError } = await supabaseClient
        .from('live_sessions')
        .upsert({
          booking_id: booking.id,
          meeting_id: meetingID,
          bbb_response: createResponse,
          status: 'created',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (meetingError) {
        console.error('Error storing meeting info:', meetingError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          meetingID,
          message: 'Meeting created successfully'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (action === 'join') {
      const displayName = userName || 
        (user.id === booking.tutor_id 
          ? `${booking.tutor_profile?.first_name} ${booking.tutor_profile?.last_name}` 
          : `${booking.student_profile?.first_name} ${booking.student_profile?.last_name}`);

      const role = user.id === booking.tutor_id ? 'moderator' : 'attendee';
      const joinUrl = await generateJoinUrl(meetingID, displayName, role);

      return new Response(
        JSON.stringify({
          success: true,
          joinUrl,
          meetingID,
          role
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (action === 'end') {
      // Only tutors can end meetings
      if (user.id !== booking.tutor_id) {
        throw new Error('Only tutors can end meetings');
      }

      const endParams = {
        meetingID,
        password: 'tutor123'
      };

      const endResponse = await callBBBApi('end', endParams);

      // Update meeting status
      const { error: updateError } = await supabaseClient
        .from('live_sessions')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('meeting_id', meetingID);

      if (updateError) {
        console.error('Error updating meeting status:', updateError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Meeting ended successfully'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('BigBlueButton API Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);