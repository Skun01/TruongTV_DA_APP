import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { SHADOWING_COPY } from '@/constants/shadowing'
import { convertRecordedAudioToWav, getSupportedRecordingMimeType } from '@/utils/audioConverter'

interface UseRecorderOptions {
  onRecordingStopped?: (audioBlob: Blob) => void
}

export function useRecorder({ onRecordingStopped }: UseRecorderOptions = {}) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)

  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const recordedAudioUrl = useMemo(() => {
    if (!recordedAudio) {
      return null
    }

    return URL.createObjectURL(recordedAudio)
  }, [recordedAudio])

  useEffect(() => {
    return () => {
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl)
      }
    }
  }, [recordedAudioUrl])

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  const startRecording = useCallback(async () => {
    if (typeof MediaRecorder === 'undefined') {
      gooeyToast.error(SHADOWING_COPY.recordingUnavailable)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = getSupportedRecordingMimeType()
      const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
      const chunks: Blob[] = []

      const resolvedMimeType = mediaRecorder.mimeType || mimeType || 'audio/webm'

      streamRef.current = stream
      setRecordedAudio(null)

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: resolvedMimeType })

        setRecordedAudio(audioBlob)
        setIsRecording(false)
        mediaRecorderRef.current = null
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null

        onRecordingStopped?.(audioBlob)
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
    } catch (error) {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      gooeyToast.error(SHADOWING_COPY.micPermissionDenied)
    }
  }, [onRecordingStopped])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
  }, [])

  const resetRecording = useCallback(() => {
    setRecordedAudio(null)
    setIsRecording(false)
    mediaRecorderRef.current = null
  }, [])

  const convertToWav = useCallback(async (): Promise<File | null> => {
    if (!recordedAudio) {
      return null
    }

    return convertRecordedAudioToWav(recordedAudio)
  }, [recordedAudio])

  return {
    isRecording,
    recordedAudio,
    recordedAudioUrl,
    startRecording,
    stopRecording,
    resetRecording,
    convertToWav,
  }
}
