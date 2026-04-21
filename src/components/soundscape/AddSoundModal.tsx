import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Mic, Square, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AddSoundModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, audioUrl: string) => void;
}

const AddSoundModal = ({ open, onClose, onAdd }: AddSoundModalProps) => {
  const [mode, setMode] = useState<"choose" | "recording">("choose");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [waveformValues, setWaveformValues] = useState<number[]>(Array(24).fill(0.1));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current?.stream?.getTracks().forEach((t) => t.stop());
    setMode("choose");
    setIsRecording(false);
    setRecordingTime(0);
    setWaveformValues(Array(24).fill(0.1));
  }, []);

  useEffect(() => {
    if (!open) cleanup();
  }, [open, cleanup]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const name = file.name.replace(/\.[^.]+$/, "");
    onAdd(name, url);
    onClose();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Waveform analyser
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const updateWaveform = () => {
        if (!analyserRef.current) return;
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        const vals = Array.from(data.slice(0, 24)).map((v) => Math.max(0.08, v / 255));
        setWaveformValues(vals);
        animFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      updateWaveform();

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        onAdd(`Recording ${timestamp}`, url);
        audioCtx.close();
        stream.getTracks().forEach((t) => t.stop());
        onClose();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setMode("recording");
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch {
      // Microphone access denied — fail silently
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl border-border/40 bg-card/95 glass-surface p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="font-display text-lg font-semibold text-foreground">
            Add a Sound
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose a sound that brings you comfort
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4">
          {mode === "choose" ? (
            <div className="grid grid-cols-2 gap-3">
              {/* Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="premium-card flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-border/40 bg-surface hover:border-primary/20 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload size={20} className="text-primary" strokeWidth={1.8} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Upload File</p>
                  <p className="text-xs text-muted-foreground mt-0.5">MP3 or WAV</p>
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/mp3,audio/wav,audio/mpeg,audio/x-wav"
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Record */}
              <button
                onClick={startRecording}
                className="premium-card flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-border/40 bg-surface hover:border-primary/20 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Mic size={20} className="text-destructive" strokeWidth={1.8} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Record</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Use microphone</p>
                </div>
              </button>
            </div>
          ) : (
            /* Recording view */
            <div className="flex flex-col items-center gap-6 py-4">
              {/* Waveform */}
              <div className="flex items-end justify-center gap-[3px] h-16 w-full max-w-[260px]">
                {waveformValues.map((v, i) => (
                  <div
                    key={i}
                    className="w-[6px] rounded-full bg-primary/60 transition-all duration-100"
                    style={{ height: `${Math.max(6, v * 64)}px` }}
                  />
                ))}
              </div>

              <p className="text-lg font-display font-semibold text-foreground tabular-nums">
                {formatTime(recordingTime)}
              </p>

              {/* Stop button */}
              <button
                onClick={stopRecording}
                className="w-16 h-16 rounded-full bg-destructive/15 border-2 border-destructive/30 flex items-center justify-center hover:bg-destructive/20 transition-colors duration-300 animate-pulse"
                aria-label="Stop recording"
              >
                <Square size={22} className="text-destructive" fill="currentColor" />
              </button>
              <p className="text-xs text-muted-foreground">Tap to stop recording</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSoundModal;
