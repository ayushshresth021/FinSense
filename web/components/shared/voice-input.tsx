'use client';

import { useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { useVoiceInput } from '../../app/lib/hooks/use-voice';
import { transactionsApi } from '../../app/lib/api';
import { ParsedTransaction } from '@/types';

interface VoiceInputProps {
  onParsed: (data: ParsedTransaction) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
}

export function VoiceInput({
  onParsed,
  isProcessing,
  setIsProcessing,
}: VoiceInputProps) {
  const { isRecording, audioBlob, startRecording, stopRecording, resetRecording } =
    useVoiceInput();
  const [error, setError] = useState('');

  const handleStartRecording = async () => {
    setError('');
    try {
      await startRecording();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
    }
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    setError('');

    try {
      const response = await transactionsApi.transcribeVoice(audioBlob);
      onParsed(response.parsed);
      resetRecording();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process voice');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Recording Button */}
      <div className="text-center">
        {!isRecording && !audioBlob && (
          <button
            onClick={handleStartRecording}
            className="w-20 h-20 mx-auto bg-gradient-to-r from-[#003566] to-[#001d3d] rounded-full flex items-center justify-center hover:from-[#004a8a] hover:to-[#002a5a] transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
          >
            <Mic className="w-8 h-8 text-white" />
          </button>
        )}

        {isRecording && (
          <button
            onClick={handleStopRecording}
            className="w-20 h-20 mx-auto bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg"
          >
            <Square className="w-8 h-8 text-white" />
          </button>
        )}

        {audioBlob && !isRecording && (
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-400/20">
              <Mic className="w-8 h-8 text-green-400" />
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={resetRecording}
                className="px-4 py-2 rounded-md bg-[rgb(var(--color-bg-tertiary))] text-secondary hover:bg-[rgb(var(--color-bg-hover))] hover:text-primary transition-all duration-200 text-sm font-medium"
                disabled={isProcessing}
              >
                Re-record
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-[#003566] to-[#001d3d] text-white hover:from-[#004a8a] hover:to-[#002a5a] transition-all duration-200 shadow-sm text-sm font-medium"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center">
        {!isRecording && !audioBlob && (
          <p className="text-sm text-secondary">
            Tap the microphone and say something like:
            <br />
            <span className="text-primary font-medium">
              &quot;I spent $20 on coffee at Starbucks&quot;
            </span>
          </p>
        )}

        {isRecording && (
          <p className="text-sm text-secondary">
            🎤 Listening... Speak now
          </p>
        )}

        {audioBlob && !isRecording && !isProcessing && (
          <p className="text-sm text-green-400">
            ✓ Recording captured! Review and submit.
          </p>
        )}

        {isProcessing && (
          <p className="text-sm text-secondary">
            Processing your voice input...
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}