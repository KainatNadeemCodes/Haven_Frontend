export interface CustomSound {
  id: string;
  name: string;
  audioUrl: string;
  isPlaying: boolean;
  volume: number;
  loop: boolean;
  fadeIn: boolean;
  fadeOut: boolean;
}

export interface SoundEnvironment {
  id: string;
  name: string;
  sounds: CustomSound[];
  isPlaying: boolean;
}
