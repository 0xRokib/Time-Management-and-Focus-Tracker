"use client";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePostData } from "@/hooks/useApi";
import { useFocusMetrics } from "@/hooks/useFocusMetrics"; // Import the hook
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SkeletonCard } from "./SkeletonLoading";

const FOCUS_TIME = 25; // Focus session duration in minutes
const BREAK_TIME = 5; // Break session duration in minutes

export function PomodoroTimer() {
  const [time, setTime] = useState(FOCUS_TIME * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const breakAudioRef = useRef<HTMLAudioElement | null>(null);

  const { user } = useAuth();
  const { dailyMetrics, isDayLoading, dayError } = useFocusMetrics();

  const { mutateAsync: logFocusSession } = usePostData(
    "/api/focus/focus-session"
  );

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsBreak(false);
    setTime(FOCUS_TIME * 60);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/focus-notification.mp3");
    breakAudioRef.current = new Audio("/sounds/break-notification.mp3");
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      if (isSoundEnabled) {
        if (!isBreak && audioRef.current) {
          audioRef.current.play();
        } else if (isBreak && breakAudioRef.current) {
          breakAudioRef.current.play();
        }
      }

      if (!isBreak) {
        setIsBreak(true);
        setTime(BREAK_TIME * 60); // Reset to break time
        toast.success("Focus session completed! Time for a break.");
        if (user) {
          logFocusSession({
            userId: user.userId,
            duration: FOCUS_TIME,
          });
        }
      } else {
        setIsBreak(false);
        setTime(FOCUS_TIME * 60); // Reset to focus time
        toast.success("Break completed! Ready for another focus session?");
        setIsActive(false); // Stop the timer after a break
      }
    }

    return () => {
      if (interval) clearInterval(interval); // Clean up interval on unmount
    };
  }, [
    isActive,
    time,
    isBreak,
    resetTimer,
    isSoundEnabled,
    logFocusSession,
    user,
  ]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive && time === FOCUS_TIME * 60) {
      toast.success("Focus session started. You can do this! 💪");
    }
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    toast.success(
      isSoundEnabled
        ? "Sound notifications disabled"
        : "Sound notifications enabled"
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate progress, and reset to 0 when the session completes
  const progress = isBreak
    ? Math.min(((BREAK_TIME * 60 - time) / (BREAK_TIME * 60)) * 100, 100)
    : Math.min(((FOCUS_TIME * 60 - time) / (FOCUS_TIME * 60)) * 100, 100);

  if (dayError) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-white space-y-4">
        <h2 className="text-xl font-semibold text-gray-400">
          Unable to load focus metrics
        </h2>
        <p className="text-sm text-gray-500">
          The server is taking too long to respond. This might be because there
          is no data yet.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 bg-[#16C784] hover:bg-[#2ECC71]"
        >
          Try Again
        </Button>
      </div>
    );
  }
  if (isDayLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="w-full h-screen flex justify-center items-center overflow-hidden">
      <Card className="bg-[#101317] text-[#E5E7EB] border-2 border-[#232B3A] rounded-2xl overflow-hidden w-full max-w-4xl h-full max-h-[600px]">
        <CardContent className="p-6 md:p-10">
          <div className="flex flex-col items-center space-y-6">
            {/* Timer header and sound toggle */}
            <div className="w-full flex justify-between items-center mb-4">
              <div className="text-xl font-semibold text-[#16C784]">
                {isBreak ? "Break Time" : "Focus Time"}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSound}
                className="hover:text-[#16C784]"
              >
                {isSoundEnabled ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Timer display */}
            <div className="relative mb-6">
              <motion.div
                className="text-8xl font-bold tracking-tighter font-mono text-[#FFFFFF]"
                animate={{ scale: isActive ? 1.05 : 1 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                {formatTime(time)}
              </motion.div>
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-[#16C784]"
                  >
                    {isBreak ? "Take a breather..." : "Stay focused!"}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-md mb-6">
              <motion.div className="relative bg-[#374151] rounded-full h-3 w-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-3 bg-[#16C784] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                  }}
                />
              </motion.div>
              <div className="flex justify-between mt-2 text-sm">
                <span>{isBreak ? "Break Progress" : "Focus Progress"}</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Timer control buttons */}
            <div className="flex gap-6 mb-6">
              <Button
                onClick={toggleTimer}
                size="lg"
                className={`w-16 h-16 rounded-full transition-all ${
                  isActive
                    ? "bg-[#374151] hover:bg-[#475569]"
                    : "bg-[#16C784] hover:bg-[#2ECC71]"
                }`}
              >
                {isActive ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
              <Button
                onClick={resetTimer}
                variant="outline"
                size="lg"
                className="w-16 h-16 rounded-full border-[#374151] hover:bg-[#475569]"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
            </div>

            {/* Sessions completed today */}
            <div className="text-sm font-medium text-[#16C784] flex items-center">
              Sessions completed today:
              <span className="text-sm font-medium text-[#FFFFFF] ml-2">
                {dailyMetrics.sessionsCompleted}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
