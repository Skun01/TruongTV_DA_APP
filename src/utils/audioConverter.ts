const PREFERRED_RECORDING_MIME_TYPES = ['audio/webm;codecs=opus', 'audio/webm'] as const
const TARGET_WAV_SAMPLE_RATE = 16000

export function getSupportedRecordingMimeType() {
  if (typeof MediaRecorder === 'undefined') {
    return ''
  }

  return PREFERRED_RECORDING_MIME_TYPES.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ?? ''
}

export async function convertRecordedAudioToWav(blob: Blob): Promise<File> {
  const arrayBuffer = await blob.arrayBuffer()
  const audioContext = new AudioContext()

  try {
    const decodedAudio = await audioContext.decodeAudioData(arrayBuffer.slice(0))
    const monoSamples = mixAudioBufferToMono(decodedAudio)
    const resampledSamples = resampleMonoSamples(monoSamples, decodedAudio.sampleRate, TARGET_WAV_SAMPLE_RATE)
    const wavBytes = encodePcm16Wave(resampledSamples, TARGET_WAV_SAMPLE_RATE)

    return new File([wavBytes], 'recording.wav', { type: 'audio/wav' })
  } finally {
    await audioContext.close()
  }
}

function mixAudioBufferToMono(audioBuffer: AudioBuffer): Float32Array {
  if (audioBuffer.numberOfChannels === 1) {
    return audioBuffer.getChannelData(0).slice()
  }

  const monoSamples = new Float32Array(audioBuffer.length)

  for (let channelIndex = 0; channelIndex < audioBuffer.numberOfChannels; channelIndex += 1) {
    const channelData = audioBuffer.getChannelData(channelIndex)

    for (let sampleIndex = 0; sampleIndex < audioBuffer.length; sampleIndex += 1) {
      monoSamples[sampleIndex] += channelData[sampleIndex] / audioBuffer.numberOfChannels
    }
  }

  return monoSamples
}

function resampleMonoSamples(input: Float32Array, sourceSampleRate: number, targetSampleRate: number): Float32Array {
  if (sourceSampleRate === targetSampleRate) {
    return input
  }

  const sampleRateRatio = sourceSampleRate / targetSampleRate
  const outputLength = Math.max(1, Math.round(input.length / sampleRateRatio))
  const output = new Float32Array(outputLength)

  for (let outputIndex = 0; outputIndex < outputLength; outputIndex += 1) {
    const sourceIndex = outputIndex * sampleRateRatio
    const leftIndex = Math.floor(sourceIndex)
    const rightIndex = Math.min(leftIndex + 1, input.length - 1)
    const interpolationWeight = sourceIndex - leftIndex
    output[outputIndex] = input[leftIndex] + (input[rightIndex] - input[leftIndex]) * interpolationWeight
  }

  return output
}

function encodePcm16Wave(samples: Float32Array, sampleRate: number): Blob {
  const bytesPerSample = 2
  const blockAlign = bytesPerSample
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample)
  const view = new DataView(buffer)

  writeWaveHeader(view, samples.length, sampleRate, blockAlign, bytesPerSample)

  let offset = 44
  for (let index = 0; index < samples.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, samples[index]))
    const normalizedSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff
    view.setInt16(offset, normalizedSample, true)
    offset += bytesPerSample
  }

  return new Blob([buffer], { type: 'audio/wav' })
}

function writeWaveHeader(
  view: DataView,
  totalSamples: number,
  sampleRate: number,
  blockAlign: number,
  bytesPerSample: number,
) {
  const byteRate = sampleRate * blockAlign
  const dataSize = totalSamples * bytesPerSample

  writeAscii(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeAscii(view, 8, 'WAVE')
  writeAscii(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, 16, true)
  writeAscii(view, 36, 'data')
  view.setUint32(40, dataSize, true)
}

function writeAscii(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index))
  }
}
