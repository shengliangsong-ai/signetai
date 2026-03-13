export interface AvatarConfig {
  id: string;
  gender: 'male' | 'female';
  age: number;
  skinColor: string;
  skinShadow: string;
  hairColor: string;
  eyeColor: string;
  hasGlasses?: boolean;
}

export const avatars: AvatarConfig[] = [
  // Females (Ages 6, 16, 26, 36, 46, 56)
  { id: 'f1', gender: 'female', age: 6, skinColor: '#ffe0d2', skinShadow: '#e8b4a1', hairColor: '#2b2d42', eyeColor: '#0284c7' },
  { id: 'f2', gender: 'female', age: 16, skinColor: '#f5cbb7', skinShadow: '#dca08a', hairColor: '#e8c37a', eyeColor: '#166534' },
  { id: 'f3', gender: 'female', age: 26, skinColor: '#e0ac69', skinShadow: '#c68f50', hairColor: '#4a3018', eyeColor: '#4a3018', hasGlasses: true },
  { id: 'f4', gender: 'female', age: 36, skinColor: '#8d5524', skinShadow: '#6b3e15', hairColor: '#1a1a1a', eyeColor: '#4a3018' },
  { id: 'f5', gender: 'female', age: 46, skinColor: '#ffe0d2', skinShadow: '#e8b4a1', hairColor: '#a53814', eyeColor: '#166534' },
  { id: 'f6', gender: 'female', age: 56, skinColor: '#3d2210', skinShadow: '#261307', hairColor: '#1a1a1a', eyeColor: '#4a3018', hasGlasses: true },
  
  // Males (Ages 6, 16, 26, 36, 46, 56)
  { id: 'm1', gender: 'male', age: 6, skinColor: '#f5cbb7', skinShadow: '#dca08a', hairColor: '#1a1a1a', eyeColor: '#166534' },
  { id: 'm2', gender: 'male', age: 16, skinColor: '#ffe0d2', skinShadow: '#e8b4a1', hairColor: '#e8c37a', eyeColor: '#0284c7' },
  { id: 'm3', gender: 'male', age: 26, skinColor: '#e0ac69', skinShadow: '#c68f50', hairColor: '#4a3018', eyeColor: '#4a3018', hasGlasses: true },
  { id: 'm4', gender: 'male', age: 36, skinColor: '#8d5524', skinShadow: '#6b3e15', hairColor: '#1a1a1a', eyeColor: '#4a3018' },
  { id: 'm5', gender: 'male', age: 46, skinColor: '#f5cbb7', skinShadow: '#dca08a', hairColor: '#a0a0a0', eyeColor: '#0284c7', hasGlasses: true },
  { id: 'm6', gender: 'male', age: 56, skinColor: '#3d2210', skinShadow: '#261307', hairColor: '#1a1a1a', eyeColor: '#4a3018' },
];
