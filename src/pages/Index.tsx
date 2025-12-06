import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { InfoCard } from "@/components/InfoCard";
import { QueueNumberCard } from "@/components/QueueNumberCard";
import { useIsAuthenticated, useAuthStore, useHasTicket, useTicket } from "@/store";
import { useCreateTicket, useUpdateTicketStatus, useDeleteTicket, useGetTicket } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/use-websocket";

export default function Index() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const hasTicket = useHasTicket();
  const ticket = useTicket();
  const setTicket = useAuthStore((state) => state.setTicket);
  const clearTicket = useAuthStore((state) => state.clearTicket);

  // WebSocket for real-time updates
  const { isConnected, lastUpdate } = useWebSocket();

  // Derive queue info from persisted ticket data
  const queueNumber = ticket?.queuePosition ?? 0;
  const peopleAhead = queueNumber > 0 ? queueNumber - 1 : 0;
  const estimatedWaitTime = (() => {
    const minutes = ticket?.waitingTime ?? 0;
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  })();

  // Handle WebSocket ticket updates - persist to store
  const ticketRef = useRef(ticket);
  ticketRef.current = ticket;
  
  useEffect(() => {
    if (lastUpdate && ticketRef.current) {
      // console.log('Received ticket update:', lastUpdate);
      // Update ticket in store with new position/wait time
      setTicket({
        ...ticketRef.current,
        status: lastUpdate.status || ticketRef.current.status,
        queuePosition: lastUpdate.queuePosition ?? ticketRef.current.queuePosition,
        waitingTime: lastUpdate.waitingTime ?? ticketRef.current.waitingTime,
      });
    }
  }, [lastUpdate, setTicket]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const getTicketMutation = useGetTicket();
  const createTicketMutation = useCreateTicket();
  const updateTicketStatusMutation = useUpdateTicketStatus();
  const deleteTicketMutation = useDeleteTicket();

  // Fetch user's existing ticket on mount (handles login/refresh scenarios)
  const hasFetchedTicket = useRef(false);
  useEffect(() => {
    if (isAuthenticated && !hasTicket && !hasFetchedTicket.current) {
      hasFetchedTicket.current = true;
      getTicketMutation.mutateAsync()
        .then((response) => {
          if (response) {
            // User has an active ticket, restore it
            setTicket({
              status: response.status,
              createdAt: response.createdAt,
              queuePosition: response.queuePosition,
              waitingTime: response.waitingTime,
            });
          }
        })
        .catch(() => {
          // No ticket found or error - user doesn't have an active ticket
        });
    }
  }, [isAuthenticated, hasTicket, setTicket, getTicketMutation]);

  const handleTakePlace = async () => {
    try {
      const response = await createTicketMutation.mutateAsync();
      
      // Store ticket in Zustand store
      setTicket({
        status: response.status,
        createdAt: response.createdAt,
      });
      
      toast({
        title: t('ticket.success'),
        description: t('ticket.successMessage'),
      });
      
      console.log('Ticket created:', response);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || '';
      
      toast({
        title: t('ticket.error'),
        description: errorMessage || t('ticket.errorMessage'),
        variant: 'destructive',
      });
      
      console.error('Failed to create ticket:', error);
    }
  };

  const handleCompleteTicket = async () => {
    try {
      const response = await updateTicketStatusMutation.mutateAsync();
      
      // Clear ticket from store since it's completed
      clearTicket();
      
      toast({
        title: t('ticket.complete.success'),
        description: t('ticket.complete.successMessage'),
      });
      
      console.log('Ticket completed:', response);
    } catch (error: any) {
      toast({
        title: t('ticket.complete.error'),
        description: error?.response?.data?.message || t('ticket.complete.errorMessage'),
        variant: 'destructive',
      });
      
      console.error('Failed to complete ticket:', error);
    }
  };

  const handleDeleteTicket = async () => {
    try {
      await deleteTicketMutation.mutateAsync();
      
      // Clear ticket from store since it's deleted
      clearTicket();
      
      toast({
        title: t('ticket.delete.success'),
        description: t('ticket.delete.successMessage'),
      });
      
      console.log('Ticket deleted');
    } catch (error: any) {
      toast({
        title: t('ticket.delete.error'),
        description: error?.response?.data?.message || t('ticket.delete.errorMessage'),
        variant: 'destructive',
      });
      
      console.error('Failed to delete ticket:', error);
    }
  };

  return (
    <Layout>
      <main className="max-w-4xl mx-auto mt-4 sm:mt-6 lg:mt-8">
        {(!isAuthenticated || !hasTicket) && (
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-blue-800 mb-2 leading-tight">
              {t('home.title')}
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 px-4">
              {t('home.subtitle')}
            </p>
          </div>
        )}

        {/* Show Queue Number Card if registered, otherwise show registration button */}
        {isAuthenticated ? (
          <>
            {hasTicket && (
              <>
                {/* WebSocket connection indicator */}
                {!isConnected && (
                  <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg mb-4 text-center text-sm">
                    Connecting to real-time updates...
                  </div>
                )}

                <QueueNumberCard
                  queueNumber={queueNumber}
                  initialPeopleAhead={peopleAhead}
                  isPaused={false}
                  status={ticket?.status}
                />

                {/* Actions Card */}
                <div className="bg-white rounded-[24px] shadow-lg px-8 sm:px-12 py-6 sm:py-8 mb-6">
                  <h2 className="text-gray-800 text-center font-bold text-2xl sm:text-3xl mb-6">
                    {t('home.actions')}
                  </h2>
    
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleCompleteTicket}
                      className="w-full h-20 sm:h-24 rounded-2xl border-4 px-6 py-4 transition-colors border-green-300 bg-green-100 hover:bg-green-200"
                    >
                      <div className="font-bold text-lg sm:text-xl mb-1 text-green-800">
                        {t('home.complete')}
                      </div>
                      <div className="text-sm sm:text-base text-green-600">
                        {t('home.completeDescription')}
                      </div>
                    </button>

                    <button 
                      onClick={handleDeleteTicket}
                      className="w-full h-20 sm:h-24 rounded-2xl border-4 px-6 py-4 transition-colors border-red-300 bg-red-100 hover:bg-red-200"
                    >
                      <div className="font-bold text-lg sm:text-xl mb-1 text-red-800">
                        {t('home.exit')}
                      </div>
                      <div className="text-sm sm:text-base text-red-600">
                        {t('home.exitDescription')}
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
                  <InfoCard icon="👥" value={peopleAhead} label={t('home.ahead')} color="blue" />
                  <InfoCard icon="⏱️" value={estimatedWaitTime} label={t('home.waitTime')} color="orange" />
                </div>
              </>
            )}

            {!hasTicket && (
              <button 
                onClick={handleTakePlace}
                disabled={createTicketMutation.isPending}
                className={`w-full h-[80px] rounded-[15px] text-white font-bold text-[22.5px] mb-[17px] transition-colors ${
                createTicketMutation.isPending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#2563EB] hover:bg-[#1d4ed8]'
                }`}
              >
                {createTicketMutation.isPending ? t('home.takingPlace') : t('home.takePlace')}
              </button>
            )}
        </>
        ) : null}
      </main>
    </Layout>
  );
}
