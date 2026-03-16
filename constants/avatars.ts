import { CustomAvatarProps } from '../components/CustomAvatar3D';

export interface AvatarConfig extends CustomAvatarProps {
  id: string;
  gender: 'male' | 'female';
  age: number;
  name?: string;
  keywords?: string[];
}

const rawAvatars: AvatarConfig[] = [
  // Females (Ages 6, 16, 26, 36, 46, 56)
  { 
    id: 'f1', gender: 'female', age: 6, 
    skinColor: '#ffe0d2', hairColor: '#2b2d42', eyeColor: '#0284c7',
    hairStyle: 'bun', eyeStyle: 'normal', noseStyle: 'button', mouthStyle: 'smile',
    clothesStyle: 'tshirt', clothesColor: '#e11d48', bgTheme: 'light',
    faceWidth: 45, eyeSize: 60, eyeAngle: 50, eyeDistance: 50, eyelidHeight: 60,
    upperLashes: 'long', lowerLashes: 'short', noseWidth: 40, noseHeight: 40, noseAngle: 50, noseTipSize: 40,
    mouthFullness: 55, mouthWidth: 45, mouthHeight: 50
  },
  { 
    id: 'f2', gender: 'female', age: 16, 
    skinColor: '#f5cbb7', hairColor: '#e8c37a', eyeColor: '#166534',
    hairStyle: 'ponytail', eyeStyle: 'normal', noseStyle: 'small', mouthStyle: 'smirk',
    clothesStyle: 'hoodie', clothesColor: '#0055FF', bgTheme: 'light',
    faceWidth: 48, eyeSize: 55, eyeAngle: 55, eyeDistance: 52, eyelidHeight: 55,
    upperLashes: 'thick', lowerLashes: 'long', noseWidth: 45, noseHeight: 45, noseAngle: 50, noseTipSize: 45,
    mouthFullness: 60, mouthWidth: 50, mouthHeight: 50
  },
  { 
    id: 'f3', gender: 'female', age: 26, 
    skinColor: '#e0ac69', hairColor: '#4a3018', eyeColor: '#4a3018',
    hairStyle: 'wavy', eyeStyle: 'glasses', noseStyle: 'pointed', mouthStyle: 'smile',
    clothesStyle: 'shirt', clothesColor: '#ffffff', bgTheme: 'light',
    faceWidth: 50, eyeSize: 50, eyeAngle: 45, eyeDistance: 48, eyelidHeight: 50,
    upperLashes: 'long', lowerLashes: 'short', noseWidth: 48, noseHeight: 50, noseAngle: 45, noseTipSize: 48,
    mouthFullness: 50, mouthWidth: 55, mouthHeight: 50
  },
  { 
    id: 'f4', gender: 'female', age: 36, 
    skinColor: '#8d5524', hairColor: '#1a1a1a', eyeColor: '#4a3018',
    hairStyle: 'dreadlocks', eyeStyle: 'normal', noseStyle: 'wide', mouthStyle: 'neutral',
    clothesStyle: 'suit', clothesColor: '#1e293b', bgTheme: 'light',
    faceWidth: 52, eyeSize: 50, eyeAngle: 50, eyeDistance: 55, eyelidHeight: 45,
    upperLashes: 'thick', lowerLashes: 'short', noseWidth: 60, noseHeight: 55, noseAngle: 50, noseTipSize: 55,
    mouthFullness: 65, mouthWidth: 60, mouthHeight: 50
  },
  { 
    id: 'f5', gender: 'female', age: 46, 
    skinColor: '#ffe0d2', hairColor: '#a53814', eyeColor: '#166534',
    hairStyle: 'short', eyeStyle: 'normal', noseStyle: 'aquiline', mouthStyle: 'thin',
    clothesStyle: 'turtleneck', clothesColor: '#16a34a', bgTheme: 'light',
    faceWidth: 50, eyeSize: 45, eyeAngle: 48, eyeDistance: 50, eyelidHeight: 40,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 45, noseHeight: 60, noseAngle: 55, noseTipSize: 45,
    mouthFullness: 40, mouthWidth: 50, mouthHeight: 40
  },
  { 
    id: 'f6', gender: 'female', age: 56, 
    skinColor: '#3d2210', hairColor: '#94a3b8', eyeColor: '#4a3018',
    hairStyle: 'afro', eyeStyle: 'glasses', noseStyle: 'broad', mouthStyle: 'smile',
    clothesStyle: 'dress', clothesColor: '#eab308', bgTheme: 'light',
    faceWidth: 55, eyeSize: 45, eyeAngle: 50, eyeDistance: 55, eyelidHeight: 35,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 65, noseHeight: 50, noseAngle: 50, noseTipSize: 60,
    mouthFullness: 70, mouthWidth: 65, mouthHeight: 50
  },
  
  { 
    id: 'f7', gender: 'female', age: 22, 
    skinColor: '#ffe0d2', hairColor: '#e11d48', eyeColor: '#0284c7',
    hairStyle: 'spiky', eyeStyle: 'sunglasses', noseStyle: 'small', mouthStyle: 'smirk',
    clothesStyle: 'jacket', clothesColor: '#1e293b', bgTheme: 'light',
    faceWidth: 48, eyeSize: 55, eyeAngle: 55, eyeDistance: 50, eyelidHeight: 50,
    upperLashes: 'long', lowerLashes: 'short', noseWidth: 42, noseHeight: 45, noseAngle: 50, noseTipSize: 42,
    mouthFullness: 55, mouthWidth: 50, mouthHeight: 50
  },
  { 
    id: 'f8', gender: 'female', age: 28, 
    skinColor: '#f5cbb7', hairColor: '#0284c7', eyeColor: '#9333ea',
    hairStyle: 'curly', eyeStyle: 'normal', noseStyle: 'button', mouthStyle: 'laugh',
    clothesStyle: 'tanktop', clothesColor: '#eab308', bgTheme: 'light',
    faceWidth: 50, eyeSize: 60, eyeAngle: 45, eyeDistance: 55, eyelidHeight: 60,
    upperLashes: 'thick', lowerLashes: 'long', noseWidth: 45, noseHeight: 40, noseAngle: 45, noseTipSize: 45,
    mouthFullness: 65, mouthWidth: 55, mouthHeight: 60
  },
  { 
    id: 'f9', gender: 'female', age: 32, 
    skinColor: '#e0ac69', hairColor: '#1a1a1a', eyeColor: '#166534',
    hairStyle: 'long', eyeStyle: 'normal', noseStyle: 'pointed', mouthStyle: 'neutral',
    clothesStyle: 'sweater', clothesColor: '#e11d48', bgTheme: 'light',
    faceWidth: 45, eyeSize: 50, eyeAngle: 50, eyeDistance: 48, eyelidHeight: 45,
    upperLashes: 'long', lowerLashes: 'none', noseWidth: 40, noseHeight: 55, noseAngle: 50, noseTipSize: 40,
    mouthFullness: 50, mouthWidth: 45, mouthHeight: 45
  },
  { 
    id: 'f10', gender: 'female', age: 40, 
    skinColor: '#8d5524', hairColor: '#4a3018', eyeColor: '#4a3018',
    hairStyle: 'bun', eyeStyle: 'glasses', noseStyle: 'broad', mouthStyle: 'smile',
    clothesStyle: 'vneck', clothesColor: '#0055FF', bgTheme: 'light',
    faceWidth: 55, eyeSize: 45, eyeAngle: 48, eyeDistance: 55, eyelidHeight: 40,
    upperLashes: 'short', lowerLashes: 'short', noseWidth: 55, noseHeight: 50, noseAngle: 55, noseTipSize: 55,
    mouthFullness: 60, mouthWidth: 60, mouthHeight: 50
  },
  { 
    id: 'f11', gender: 'female', age: 50, 
    skinColor: '#ffe0d2', hairColor: '#a0a0a0', eyeColor: '#0284c7',
    hairStyle: 'wavy', eyeStyle: 'normal', noseStyle: 'aquiline', mouthStyle: 'thin',
    clothesStyle: 'suit', clothesColor: '#1e293b', bgTheme: 'light',
    faceWidth: 48, eyeSize: 45, eyeAngle: 50, eyeDistance: 50, eyelidHeight: 35,
    upperLashes: 'none', lowerLashes: 'none', noseWidth: 45, noseHeight: 60, noseAngle: 45, noseTipSize: 45,
    mouthFullness: 40, mouthWidth: 50, mouthHeight: 40
  },
  { 
    id: 'f12', gender: 'female', age: 60, 
    skinColor: '#3d2210', hairColor: '#94a3b8', eyeColor: '#4a3018',
    hairStyle: 'short', eyeStyle: 'glasses', noseStyle: 'wide', mouthStyle: 'smile',
    clothesStyle: 'turtleneck', clothesColor: '#16a34a', bgTheme: 'light',
    faceWidth: 52, eyeSize: 45, eyeAngle: 50, eyeDistance: 52, eyelidHeight: 35,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 60, noseHeight: 50, noseAngle: 50, noseTipSize: 60,
    mouthFullness: 55, mouthWidth: 55, mouthHeight: 45
  },
  
  // Males (Ages 6, 16, 26, 36, 46, 56)
  { 
    id: 'm1', gender: 'male', age: 6, 
    skinColor: '#f5cbb7', hairColor: '#1a1a1a', eyeColor: '#166534',
    hairStyle: 'short', eyeStyle: 'normal', noseStyle: 'button', mouthStyle: 'smile',
    clothesStyle: 'tshirt', clothesColor: '#0055FF', bgTheme: 'light',
    facialHairStyle: 'none',
    faceWidth: 48, eyeSize: 55, eyeAngle: 50, eyeDistance: 50, eyelidHeight: 55,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 45, noseHeight: 40, noseAngle: 50, noseTipSize: 45,
    mouthFullness: 50, mouthWidth: 45, mouthHeight: 50
  },
  { 
    id: 'm2', gender: 'male', age: 16, 
    skinColor: '#ffe0d2', hairColor: '#e8c37a', eyeColor: '#0284c7',
    hairStyle: 'spiky', eyeStyle: 'normal', noseStyle: 'small', mouthStyle: 'smirk',
    clothesStyle: 'hoodie', clothesColor: '#e11d48', bgTheme: 'light',
    facialHairStyle: 'none',
    faceWidth: 50, eyeSize: 50, eyeAngle: 52, eyeDistance: 50, eyelidHeight: 50,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 48, noseHeight: 48, noseAngle: 50, noseTipSize: 48,
    mouthFullness: 45, mouthWidth: 50, mouthHeight: 50
  },
  { 
    id: 'm3', gender: 'male', age: 26, 
    skinColor: '#e0ac69', hairColor: '#4a3018', eyeColor: '#4a3018',
    hairStyle: 'fade', eyeStyle: 'glasses', noseStyle: 'roman', mouthStyle: 'neutral',
    clothesStyle: 'shirt', clothesColor: '#ffffff', bgTheme: 'light',
    facialHairStyle: 'stubble', facialHairColor: '#4a3018',
    faceWidth: 52, eyeSize: 48, eyeAngle: 48, eyeDistance: 52, eyelidHeight: 48,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 52, noseHeight: 55, noseAngle: 48, noseTipSize: 50,
    mouthFullness: 45, mouthWidth: 55, mouthHeight: 45
  },
  { 
    id: 'm4', gender: 'male', age: 36, 
    skinColor: '#8d5524', hairColor: '#1a1a1a', eyeColor: '#4a3018',
    hairStyle: 'buzzcut', eyeStyle: 'normal', noseStyle: 'broad', mouthStyle: 'neutral',
    clothesStyle: 'suit', clothesColor: '#1e293b', bgTheme: 'light',
    facialHairStyle: 'beard', facialHairColor: '#1a1a1a',
    faceWidth: 55, eyeSize: 48, eyeAngle: 50, eyeDistance: 55, eyelidHeight: 45,
    upperLashes: 'none', lowerLashes: 'none', noseWidth: 60, noseHeight: 55, noseAngle: 50, noseTipSize: 55,
    mouthFullness: 55, mouthWidth: 60, mouthHeight: 45
  },
  { 
    id: 'm5', gender: 'male', age: 46, 
    skinColor: '#f5cbb7', hairColor: '#a0a0a0', eyeColor: '#0284c7',
    hairStyle: 'short', eyeStyle: 'glasses', noseStyle: 'aquiline', mouthStyle: 'smile',
    clothesStyle: 'sweater', clothesColor: '#16a34a', bgTheme: 'light',
    facialHairStyle: 'mustache', facialHairColor: '#a0a0a0',
    faceWidth: 52, eyeSize: 45, eyeAngle: 50, eyeDistance: 50, eyelidHeight: 40,
    upperLashes: 'none', lowerLashes: 'none', noseWidth: 50, noseHeight: 60, noseAngle: 55, noseTipSize: 48,
    mouthFullness: 40, mouthWidth: 55, mouthHeight: 40
  },
  { 
    id: 'm6', gender: 'male', age: 56, 
    skinColor: '#3d2210', hairColor: '#94a3b8', eyeColor: '#4a3018',
    hairStyle: 'bald', eyeStyle: 'normal', noseStyle: 'wide', mouthStyle: 'thin',
    clothesStyle: 'turtleneck', clothesColor: '#eab308', bgTheme: 'light',
    facialHairStyle: 'goatee', facialHairColor: '#94a3b8',
    faceWidth: 55, eyeSize: 45, eyeAngle: 50, eyeDistance: 55, eyelidHeight: 35,
    upperLashes: 'none', lowerLashes: 'none', noseWidth: 65, noseHeight: 55, noseAngle: 50, noseTipSize: 60,
    mouthFullness: 45, mouthWidth: 60, mouthHeight: 40
  },
  { 
    id: 'm7', gender: 'male', age: 22, 
    skinColor: '#ffe0d2', hairColor: '#e11d48', eyeColor: '#0284c7',
    hairStyle: 'mohawk', eyeStyle: 'sunglasses', noseStyle: 'small', mouthStyle: 'smirk',
    clothesStyle: 'jacket', clothesColor: '#1e293b', bgTheme: 'light',
    facialHairStyle: 'none',
    faceWidth: 48, eyeSize: 55, eyeAngle: 55, eyeDistance: 50, eyelidHeight: 50,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 42, noseHeight: 45, noseAngle: 50, noseTipSize: 42,
    mouthFullness: 55, mouthWidth: 50, mouthHeight: 50
  },
  { 
    id: 'm8', gender: 'male', age: 28, 
    skinColor: '#f5cbb7', hairColor: '#0284c7', eyeColor: '#9333ea',
    hairStyle: 'curly', eyeStyle: 'normal', noseStyle: 'button', mouthStyle: 'laugh',
    clothesStyle: 'tanktop', clothesColor: '#eab308', bgTheme: 'light',
    facialHairStyle: 'stubble', facialHairColor: '#0284c7',
    faceWidth: 50, eyeSize: 60, eyeAngle: 45, eyeDistance: 55, eyelidHeight: 60,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 45, noseHeight: 40, noseAngle: 45, noseTipSize: 45,
    mouthFullness: 65, mouthWidth: 55, mouthHeight: 60
  },
  { 
    id: 'm9', gender: 'male', age: 32, 
    skinColor: '#e0ac69', hairColor: '#1a1a1a', eyeColor: '#166534',
    hairStyle: 'dreadlocks', eyeStyle: 'normal', noseStyle: 'pointed', mouthStyle: 'neutral',
    clothesStyle: 'sweater', clothesColor: '#e11d48', bgTheme: 'light',
    facialHairStyle: 'beard', facialHairColor: '#1a1a1a',
    faceWidth: 45, eyeSize: 50, eyeAngle: 50, eyeDistance: 48, eyelidHeight: 45,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 40, noseHeight: 55, noseAngle: 50, noseTipSize: 40,
    mouthFullness: 50, mouthWidth: 45, mouthHeight: 45
  },
  { 
    id: 'm10', gender: 'male', age: 40, 
    skinColor: '#8d5524', hairColor: '#4a3018', eyeColor: '#4a3018',
    hairStyle: 'afro', eyeStyle: 'glasses', noseStyle: 'broad', mouthStyle: 'smile',
    clothesStyle: 'vneck', clothesColor: '#0055FF', bgTheme: 'light',
    facialHairStyle: 'mustache', facialHairColor: '#4a3018',
    faceWidth: 55, eyeSize: 45, eyeAngle: 48, eyeDistance: 55, eyelidHeight: 40,
    upperLashes: 'none', lowerLashes: 'none', noseWidth: 55, noseHeight: 50, noseAngle: 55, noseTipSize: 55,
    mouthFullness: 60, mouthWidth: 60, mouthHeight: 50
  },
  { 
    id: 'm11', gender: 'male', age: 50, 
    skinColor: '#ffe0d2', hairColor: '#a0a0a0', eyeColor: '#0284c7',
    hairStyle: 'wavy', eyeStyle: 'normal', noseStyle: 'aquiline', mouthStyle: 'thin',
    clothesStyle: 'suit', clothesColor: '#1e293b', bgTheme: 'light',
    facialHairStyle: 'none',
    faceWidth: 48, eyeSize: 45, eyeAngle: 50, eyeDistance: 50, eyelidHeight: 35,
    upperLashes: 'none', lowerLashes: 'none', noseWidth: 45, noseHeight: 60, noseAngle: 45, noseTipSize: 45,
    mouthFullness: 40, mouthWidth: 50, mouthHeight: 40
  },
  { 
    id: 'm12', gender: 'male', age: 60, 
    skinColor: '#3d2210', hairColor: '#94a3b8', eyeColor: '#4a3018',
    hairStyle: 'buzzcut', eyeStyle: 'glasses', noseStyle: 'wide', mouthStyle: 'smile',
    clothesStyle: 'turtleneck', clothesColor: '#16a34a', bgTheme: 'light',
    facialHairStyle: 'goatee', facialHairColor: '#94a3b8',
    faceWidth: 52, eyeSize: 45, eyeAngle: 50, eyeDistance: 52, eyelidHeight: 35,
    upperLashes: 'none', lowerLashes: 'none', noseWidth: 60, noseHeight: 50, noseAngle: 50, noseTipSize: 60,
    mouthFullness: 55, mouthWidth: 55, mouthHeight: 45
  },
  
  // New Female Avatars with Career/Interesting Styles
  { 
    id: 'f13', gender: 'female', age: 30, 
    skinColor: '#f5cbb7', hairColor: '#1a1a1a', eyeColor: '#4a3018',
    hairStyle: 'bun', eyeStyle: 'normal', noseStyle: 'small', mouthStyle: 'smile',
    clothesStyle: 'doctor', clothesColor: '#ffffff', bgTheme: 'light',
    faceWidth: 48, eyeSize: 52, eyeAngle: 50, eyeDistance: 50, eyelidHeight: 50,
    upperLashes: 'long', lowerLashes: 'short', noseWidth: 45, noseHeight: 48, noseAngle: 50, noseTipSize: 45,
    mouthFullness: 55, mouthWidth: 50, mouthHeight: 50
  },
  { 
    id: 'f14', gender: 'female', age: 28, 
    skinColor: '#e0ac69', hairColor: '#4a3018', eyeColor: '#166534',
    hairStyle: 'ponytail', eyeStyle: 'normal', noseStyle: 'button', mouthStyle: 'laugh',
    clothesStyle: 'chef', clothesColor: '#ffffff', bgTheme: 'light',
    faceWidth: 50, eyeSize: 55, eyeAngle: 48, eyeDistance: 52, eyelidHeight: 55,
    upperLashes: 'thick', lowerLashes: 'short', noseWidth: 48, noseHeight: 45, noseAngle: 48, noseTipSize: 48,
    mouthFullness: 60, mouthWidth: 55, mouthHeight: 55
  },
  { 
    id: 'f15', gender: 'female', age: 35, 
    skinColor: '#8d5524', hairColor: '#1a1a1a', eyeColor: '#4a3018',
    hairStyle: 'short', eyeStyle: 'sunglasses', noseStyle: 'broad', mouthStyle: 'smirk',
    clothesStyle: 'police', clothesColor: '#1e293b', bgTheme: 'light',
    faceWidth: 52, eyeSize: 50, eyeAngle: 52, eyeDistance: 50, eyelidHeight: 48,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 55, noseHeight: 50, noseAngle: 52, noseTipSize: 55,
    mouthFullness: 50, mouthWidth: 55, mouthHeight: 45
  },
  { 
    id: 'f16', gender: 'female', age: 40, 
    skinColor: '#ffe0d2', hairColor: '#a0a0a0', eyeColor: '#0284c7',
    hairStyle: 'wavy', eyeStyle: 'normal', noseStyle: 'aquiline', mouthStyle: 'neutral',
    clothesStyle: 'astronaut', clothesColor: '#ffffff', bgTheme: 'light',
    faceWidth: 48, eyeSize: 48, eyeAngle: 50, eyeDistance: 50, eyelidHeight: 45,
    upperLashes: 'long', lowerLashes: 'short', noseWidth: 45, noseHeight: 55, noseAngle: 48, noseTipSize: 45,
    mouthFullness: 45, mouthWidth: 50, mouthHeight: 45
  },
  { 
    id: 'f17', gender: 'female', age: 25, 
    skinColor: '#f5cbb7', hairColor: '#e8c37a', eyeColor: '#0284c7',
    hairStyle: 'long', eyeStyle: 'normal', noseStyle: 'small', mouthStyle: 'smile',
    clothesStyle: 'farmer', clothesColor: '#16a34a', bgTheme: 'light',
    faceWidth: 48, eyeSize: 55, eyeAngle: 50, eyeDistance: 50, eyelidHeight: 55,
    upperLashes: 'long', lowerLashes: 'short', noseWidth: 42, noseHeight: 45, noseAngle: 50, noseTipSize: 42,
    mouthFullness: 55, mouthWidth: 50, mouthHeight: 50
  },
  { 
    id: 'f18', gender: 'female', age: 22, 
    skinColor: '#e0ac69', hairColor: '#e11d48', eyeColor: '#9333ea',
    hairStyle: 'mohawk', eyeStyle: 'normal', noseStyle: 'pointed', mouthStyle: 'smirk',
    clothesStyle: 'cyberpunk', clothesColor: '#e11d48', bgTheme: 'light',
    faceWidth: 45, eyeSize: 52, eyeAngle: 55, eyeDistance: 48, eyelidHeight: 50,
    upperLashes: 'thick', lowerLashes: 'short', noseWidth: 40, noseHeight: 50, noseAngle: 55, noseTipSize: 40,
    mouthFullness: 50, mouthWidth: 48, mouthHeight: 48
  },
  { 
    id: 'f19', gender: 'female', age: 26, 
    skinColor: '#3d2210', hairColor: '#1a1a1a', eyeColor: '#4a3018',
    hairStyle: 'dreadlocks', eyeStyle: 'normal', noseStyle: 'wide', mouthStyle: 'neutral',
    clothesStyle: 'ninja', clothesColor: '#1a1a1a', bgTheme: 'light',
    faceWidth: 50, eyeSize: 50, eyeAngle: 50, eyeDistance: 52, eyelidHeight: 48,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 55, noseHeight: 48, noseAngle: 50, noseTipSize: 55,
    mouthFullness: 55, mouthWidth: 55, mouthHeight: 50
  },
  { 
    id: 'f20', gender: 'female', age: 65, 
    skinColor: '#ffe0d2', hairColor: '#94a3b8', eyeColor: '#0284c7',
    hairStyle: 'curly', eyeStyle: 'glasses', noseStyle: 'roman', mouthStyle: 'smile',
    clothesStyle: 'wizard', clothesColor: '#9333ea', bgTheme: 'light',
    faceWidth: 50, eyeSize: 45, eyeAngle: 50, eyeDistance: 50, eyelidHeight: 40,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 48, noseHeight: 55, noseAngle: 48, noseTipSize: 48,
    mouthFullness: 45, mouthWidth: 52, mouthHeight: 45
  },
  { 
    id: 'f21', gender: 'female', age: 24, 
    skinColor: '#f5cbb7', hairColor: '#4a3018', eyeColor: '#166534',
    hairStyle: 'ponytail', eyeStyle: 'normal', noseStyle: 'button', mouthStyle: 'open',
    clothesStyle: 'sports', clothesColor: '#0055FF', bgTheme: 'light',
    faceWidth: 48, eyeSize: 55, eyeAngle: 48, eyeDistance: 50, eyelidHeight: 55,
    upperLashes: 'long', lowerLashes: 'short', noseWidth: 45, noseHeight: 45, noseAngle: 48, noseTipSize: 45,
    mouthFullness: 60, mouthWidth: 50, mouthHeight: 60
  },
  { 
    id: 'f22', gender: 'female', age: 32, 
    skinColor: '#e0ac69', hairColor: '#1a1a1a', eyeColor: '#4a3018',
    hairStyle: 'bun', eyeStyle: 'sunglasses', noseStyle: 'small', mouthStyle: 'neutral',
    clothesStyle: 'military', clothesColor: '#166534', bgTheme: 'light',
    faceWidth: 50, eyeSize: 50, eyeAngle: 50, eyeDistance: 50, eyelidHeight: 50,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 48, noseHeight: 48, noseAngle: 50, noseTipSize: 48,
    mouthFullness: 50, mouthWidth: 52, mouthHeight: 48
  },
  { 
    id: 'f23', gender: 'female', age: 45, 
    skinColor: '#8d5524', hairColor: '#1a1a1a', eyeColor: '#4a3018',
    hairStyle: 'short', eyeStyle: 'normal', noseStyle: 'broad', mouthStyle: 'smile',
    clothesStyle: 'royal', clothesColor: '#eab308', bgTheme: 'light',
    faceWidth: 52, eyeSize: 50, eyeAngle: 50, eyeDistance: 52, eyelidHeight: 48,
    upperLashes: 'long', lowerLashes: 'short', noseWidth: 55, noseHeight: 50, noseAngle: 50, noseTipSize: 55,
    mouthFullness: 55, mouthWidth: 55, mouthHeight: 50
  },
  { 
    id: 'f24', gender: 'female', age: 29, 
    skinColor: '#ffe0d2', hairColor: '#e8c37a', eyeColor: '#0284c7',
    hairStyle: 'long', eyeStyle: 'normal', noseStyle: 'pointed', mouthStyle: 'laugh',
    clothesStyle: 'construction', clothesColor: '#eab308', bgTheme: 'light',
    faceWidth: 48, eyeSize: 52, eyeAngle: 52, eyeDistance: 50, eyelidHeight: 52,
    upperLashes: 'long', lowerLashes: 'short', noseWidth: 42, noseHeight: 50, noseAngle: 52, noseTipSize: 42,
    mouthFullness: 60, mouthWidth: 50, mouthHeight: 55
  },

  // New Male Avatars with Career/Interesting Styles
  { 
    id: 'm13', gender: 'male', age: 35, 
    skinColor: '#f5cbb7', hairColor: '#1a1a1a', eyeColor: '#4a3018',
    hairStyle: 'short', eyeStyle: 'normal', noseStyle: 'roman', mouthStyle: 'neutral',
    clothesStyle: 'doctor', clothesColor: '#ffffff', bgTheme: 'light',
    facialHairStyle: 'stubble', facialHairColor: '#1a1a1a',
    faceWidth: 50, eyeSize: 48, eyeAngle: 50, eyeDistance: 50, eyelidHeight: 48,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 50, noseHeight: 55, noseAngle: 50, noseTipSize: 50,
    mouthFullness: 45, mouthWidth: 55, mouthHeight: 45
  },
  { 
    id: 'm14', gender: 'male', age: 42, 
    skinColor: '#e0ac69', hairColor: '#4a3018', eyeColor: '#166534',
    hairStyle: 'bald', eyeStyle: 'normal', noseStyle: 'broad', mouthStyle: 'smile',
    clothesStyle: 'chef', clothesColor: '#ffffff', bgTheme: 'light',
    facialHairStyle: 'mustache', facialHairColor: '#4a3018',
    faceWidth: 55, eyeSize: 48, eyeAngle: 48, eyeDistance: 55, eyelidHeight: 45,
    upperLashes: 'none', lowerLashes: 'none', noseWidth: 58, noseHeight: 50, noseAngle: 48, noseTipSize: 58,
    mouthFullness: 55, mouthWidth: 60, mouthHeight: 50
  },
  { 
    id: 'm15', gender: 'male', age: 30, 
    skinColor: '#8d5524', hairColor: '#1a1a1a', eyeColor: '#4a3018',
    hairStyle: 'buzzcut', eyeStyle: 'sunglasses', noseStyle: 'wide', mouthStyle: 'smirk',
    clothesStyle: 'police', clothesColor: '#1e293b', bgTheme: 'light',
    facialHairStyle: 'none',
    faceWidth: 52, eyeSize: 50, eyeAngle: 52, eyeDistance: 52, eyelidHeight: 50,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 55, noseHeight: 48, noseAngle: 52, noseTipSize: 55,
    mouthFullness: 50, mouthWidth: 55, mouthHeight: 48
  },
  { 
    id: 'm16', gender: 'male', age: 38, 
    skinColor: '#ffe0d2', hairColor: '#a0a0a0', eyeColor: '#0284c7',
    hairStyle: 'short', eyeStyle: 'normal', noseStyle: 'aquiline', mouthStyle: 'neutral',
    clothesStyle: 'astronaut', clothesColor: '#ffffff', bgTheme: 'light',
    facialHairStyle: 'goatee', facialHairColor: '#a0a0a0',
    faceWidth: 48, eyeSize: 48, eyeAngle: 50, eyeDistance: 50, eyelidHeight: 45,
    upperLashes: 'none', lowerLashes: 'none', noseWidth: 48, noseHeight: 58, noseAngle: 48, noseTipSize: 48,
    mouthFullness: 45, mouthWidth: 50, mouthHeight: 45
  },
  { 
    id: 'm17', gender: 'male', age: 45, 
    skinColor: '#f5cbb7', hairColor: '#e8c37a', eyeColor: '#0284c7',
    hairStyle: 'wavy', eyeStyle: 'normal', noseStyle: 'button', mouthStyle: 'smile',
    clothesStyle: 'farmer', clothesColor: '#16a34a', bgTheme: 'light',
    facialHairStyle: 'beard', facialHairColor: '#e8c37a',
    faceWidth: 50, eyeSize: 50, eyeAngle: 50, eyeDistance: 50, eyelidHeight: 48,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 48, noseHeight: 48, noseAngle: 50, noseTipSize: 48,
    mouthFullness: 50, mouthWidth: 52, mouthHeight: 50
  },
  { 
    id: 'm18', gender: 'male', age: 24, 
    skinColor: '#e0ac69', hairColor: '#0284c7', eyeColor: '#9333ea',
    hairStyle: 'spiky', eyeStyle: 'normal', noseStyle: 'pointed', mouthStyle: 'smirk',
    clothesStyle: 'cyberpunk', clothesColor: '#0284c7', bgTheme: 'light',
    facialHairStyle: 'none',
    faceWidth: 48, eyeSize: 52, eyeAngle: 55, eyeDistance: 48, eyelidHeight: 52,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 45, noseHeight: 50, noseAngle: 55, noseTipSize: 45,
    mouthFullness: 48, mouthWidth: 50, mouthHeight: 48
  },
  { 
    id: 'm19', gender: 'male', age: 28, 
    skinColor: '#3d2210', hairColor: '#1a1a1a', eyeColor: '#4a3018',
    hairStyle: 'dreadlocks', eyeStyle: 'normal', noseStyle: 'wide', mouthStyle: 'neutral',
    clothesStyle: 'ninja', clothesColor: '#1a1a1a', bgTheme: 'light',
    facialHairStyle: 'none',
    faceWidth: 52, eyeSize: 50, eyeAngle: 50, eyeDistance: 52, eyelidHeight: 50,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 55, noseHeight: 48, noseAngle: 50, noseTipSize: 55,
    mouthFullness: 55, mouthWidth: 55, mouthHeight: 50
  },
  { 
    id: 'm20', gender: 'male', age: 70, 
    skinColor: '#ffe0d2', hairColor: '#94a3b8', eyeColor: '#0284c7',
    hairStyle: 'long', eyeStyle: 'glasses', noseStyle: 'aquiline', mouthStyle: 'smile',
    clothesStyle: 'wizard', clothesColor: '#9333ea', bgTheme: 'light',
    facialHairStyle: 'beard', facialHairColor: '#94a3b8',
    faceWidth: 48, eyeSize: 45, eyeAngle: 50, eyeDistance: 50, eyelidHeight: 40,
    upperLashes: 'none', lowerLashes: 'none', noseWidth: 48, noseHeight: 60, noseAngle: 48, noseTipSize: 48,
    mouthFullness: 40, mouthWidth: 50, mouthHeight: 40
  },
  { 
    id: 'm21', gender: 'male', age: 22, 
    skinColor: '#f5cbb7', hairColor: '#4a3018', eyeColor: '#166534',
    hairStyle: 'fade', eyeStyle: 'normal', noseStyle: 'small', mouthStyle: 'open',
    clothesStyle: 'sports', clothesColor: '#0055FF', bgTheme: 'light',
    facialHairStyle: 'none',
    faceWidth: 48, eyeSize: 52, eyeAngle: 48, eyeDistance: 50, eyelidHeight: 52,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 45, noseHeight: 45, noseAngle: 48, noseTipSize: 45,
    mouthFullness: 55, mouthWidth: 50, mouthHeight: 55
  },
  { 
    id: 'm22', gender: 'male', age: 33, 
    skinColor: '#e0ac69', hairColor: '#1a1a1a', eyeColor: '#4a3018',
    hairStyle: 'buzzcut', eyeStyle: 'sunglasses', noseStyle: 'broad', mouthStyle: 'neutral',
    clothesStyle: 'military', clothesColor: '#166534', bgTheme: 'light',
    facialHairStyle: 'stubble', facialHairColor: '#1a1a1a',
    faceWidth: 52, eyeSize: 50, eyeAngle: 50, eyeDistance: 52, eyelidHeight: 50,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 52, noseHeight: 50, noseAngle: 50, noseTipSize: 52,
    mouthFullness: 50, mouthWidth: 55, mouthHeight: 48
  },
  { 
    id: 'm23', gender: 'male', age: 55, 
    skinColor: '#8d5524', hairColor: '#a0a0a0', eyeColor: '#4a3018',
    hairStyle: 'short', eyeStyle: 'normal', noseStyle: 'roman', mouthStyle: 'smile',
    clothesStyle: 'royal', clothesColor: '#eab308', bgTheme: 'light',
    facialHairStyle: 'mustache', facialHairColor: '#a0a0a0',
    faceWidth: 55, eyeSize: 48, eyeAngle: 50, eyeDistance: 55, eyelidHeight: 45,
    upperLashes: 'none', lowerLashes: 'none', noseWidth: 55, noseHeight: 55, noseAngle: 50, noseTipSize: 55,
    mouthFullness: 50, mouthWidth: 60, mouthHeight: 45
  },
  { 
    id: 'm24', gender: 'male', age: 29, 
    skinColor: '#ffe0d2', hairColor: '#e8c37a', eyeColor: '#0284c7',
    hairStyle: 'curly', eyeStyle: 'normal', noseStyle: 'button', mouthStyle: 'laugh',
    clothesStyle: 'construction', clothesColor: '#eab308', bgTheme: 'light',
    facialHairStyle: 'stubble', facialHairColor: '#e8c37a',
    faceWidth: 50, eyeSize: 52, eyeAngle: 52, eyeDistance: 50, eyelidHeight: 52,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 48, noseHeight: 48, noseAngle: 52, noseTipSize: 48,
    mouthFullness: 55, mouthWidth: 52, mouthHeight: 55
  },
  { 
    id: 'f25', gender: 'female', age: 55, 
    skinColor: '#e0ac69', hairColor: '#1a1a1a', eyeColor: '#4a3018',
    hairStyle: 'ponytail', eyeStyle: 'glasses', noseStyle: 'snub', mouthStyle: 'open',
    clothesStyle: 'shirt', clothesColor: '#16a34a', bgTheme: 'light',
    headwear: 'conical',
    faceWidth: 58, eyeSize: 43, eyeAngle: 54, eyeDistance: 42, eyelidHeight: 53,
    upperLashes: 'short', lowerLashes: 'short', noseWidth: 48, noseHeight: 43, noseAngle: 53, noseTipSize: 55,
    mouthFullness: 50, mouthWidth: 56, mouthHeight: 60
  },
  { 
    id: 'f26', gender: 'female', age: 45, 
    skinColor: '#ffe0d2', hairColor: '#94a3b8', eyeColor: '#0284c7',
    hairStyle: 'short', eyeStyle: 'normal', noseStyle: 'broad', mouthStyle: 'thin',
    clothesStyle: 'tshirt', clothesColor: '#ffffff', bgTheme: 'light',
    headwear: 'hijab',
    faceWidth: 58, eyeSize: 46, eyeAngle: 40, eyeDistance: 48, eyelidHeight: 42,
    upperLashes: 'long', lowerLashes: 'long', noseWidth: 51, noseHeight: 54, noseAngle: 52, noseTipSize: 59,
    mouthFullness: 55, mouthWidth: 47, mouthHeight: 46
  },
  { 
    id: 'f27', gender: 'female', age: 28, 
    skinColor: '#e0ac69', hairColor: '#a53814', eyeColor: '#0284c7',
    hairStyle: 'curly', eyeStyle: 'normal', noseStyle: 'aquiline', mouthStyle: 'sad',
    clothesStyle: 'dashiki', clothesColor: '#e11d48', bgTheme: 'light',
    headwear: 'headband',
    faceWidth: 58, eyeSize: 54, eyeAngle: 56, eyeDistance: 56, eyelidHeight: 41,
    upperLashes: 'thick', lowerLashes: 'none', noseWidth: 58, noseHeight: 60, noseAngle: 50, noseTipSize: 42,
    mouthFullness: 44, mouthWidth: 53, mouthHeight: 56
  },
  { 
    id: 'f28', gender: 'female', age: 28, 
    skinColor: '#e0ac69', hairColor: '#a53814', eyeColor: '#9333ea',
    hairStyle: 'bun', eyeStyle: 'normal', noseStyle: 'snub', mouthStyle: 'open',
    clothesStyle: 'military', clothesColor: '#ffffff', bgTheme: 'light',
    headwear: 'conical',
    faceWidth: 59, eyeSize: 54, eyeAngle: 43, eyeDistance: 45, eyelidHeight: 58,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 44, noseHeight: 44, noseAngle: 59, noseTipSize: 45,
    mouthFullness: 45, mouthWidth: 41, mouthHeight: 48
  },
  { 
    id: 'f29', gender: 'female', age: 39, 
    skinColor: '#f5cbb7', hairColor: '#0284c7', eyeColor: '#9333ea',
    hairStyle: 'afro', eyeStyle: 'normal', noseStyle: 'button', mouthStyle: 'pout',
    clothesStyle: 'tshirt', clothesColor: '#eab308', bgTheme: 'light',
    headwear: 'crown',
    faceWidth: 56, eyeSize: 52, eyeAngle: 46, eyeDistance: 40, eyelidHeight: 44,
    upperLashes: 'short', lowerLashes: 'short', noseWidth: 56, noseHeight: 42, noseAngle: 48, noseTipSize: 60,
    mouthFullness: 41, mouthWidth: 41, mouthHeight: 51
  },
  { 
    id: 'f30', gender: 'female', age: 42, 
    skinColor: '#e0ac69', hairColor: '#a53814', eyeColor: '#9333ea',
    hairStyle: 'curly', eyeStyle: 'normal', noseStyle: 'small', mouthStyle: 'sad',
    clothesStyle: 'tshirt', clothesColor: '#ffffff', bgTheme: 'light',
    headwear: 'cowboy',
    faceWidth: 60, eyeSize: 43, eyeAngle: 59, eyeDistance: 43, eyelidHeight: 40,
    upperLashes: 'none', lowerLashes: 'short', noseWidth: 40, noseHeight: 52, noseAngle: 54, noseTipSize: 51,
    mouthFullness: 56, mouthWidth: 44, mouthHeight: 46
  },
  { 
    id: 'f31', gender: 'female', age: 29, 
    skinColor: '#8d5524', hairColor: '#4a3018', eyeColor: '#166534',
    hairStyle: 'ponytail', eyeStyle: 'sunglasses', noseStyle: 'wide', mouthStyle: 'neutral',
    clothesStyle: 'dashiki', clothesColor: '#ffffff', bgTheme: 'light',
    headwear: 'turban',
    faceWidth: 52, eyeSize: 55, eyeAngle: 60, eyeDistance: 47, eyelidHeight: 51,
    upperLashes: 'short', lowerLashes: 'long', noseWidth: 41, noseHeight: 44, noseAngle: 51, noseTipSize: 50,
    mouthFullness: 57, mouthWidth: 53, mouthHeight: 44
  },
  { 
    id: 'f32', gender: 'female', age: 57, 
    skinColor: '#8d5524', hairColor: '#0284c7', eyeColor: '#9333ea',
    hairStyle: 'short', eyeStyle: 'glasses', noseStyle: 'small', mouthStyle: 'neutral',
    clothesStyle: 'sweater', clothesColor: '#1e293b', bgTheme: 'light',
    headwear: 'none',
    faceWidth: 45, eyeSize: 60, eyeAngle: 49, eyeDistance: 59, eyelidHeight: 52,
    upperLashes: 'long', lowerLashes: 'short', noseWidth: 53, noseHeight: 59, noseAngle: 46, noseTipSize: 51,
    mouthFullness: 51, mouthWidth: 57, mouthHeight: 52
  },
  { 
    id: 'f33', gender: 'female', age: 44, 
    skinColor: '#8d5524', hairColor: '#e8c37a', eyeColor: '#9333ea',
    hairStyle: 'wavy', eyeStyle: 'sunglasses', noseStyle: 'flat', mouthStyle: 'smile',
    clothesStyle: 'tanktop', clothesColor: '#16a34a', bgTheme: 'light',
    headwear: 'beanie',
    faceWidth: 44, eyeSize: 49, eyeAngle: 40, eyeDistance: 40, eyelidHeight: 46,
    upperLashes: 'none', lowerLashes: 'none', noseWidth: 60, noseHeight: 49, noseAngle: 56, noseTipSize: 58,
    mouthFullness: 49, mouthWidth: 57, mouthHeight: 56
  },
  { 
    id: 'f34', gender: 'female', age: 27, 
    skinColor: '#e0ac69', hairColor: '#e11d48', eyeColor: '#9333ea',
    hairStyle: 'long', eyeStyle: 'sunglasses', noseStyle: 'snub', mouthStyle: 'thin',
    clothesStyle: 'tshirt', clothesColor: '#1e293b', bgTheme: 'light',
    headwear: 'headband',
    faceWidth: 59, eyeSize: 50, eyeAngle: 53, eyeDistance: 57, eyelidHeight: 58,
    upperLashes: 'long', lowerLashes: 'long', noseWidth: 53, noseHeight: 47, noseAngle: 43, noseTipSize: 46,
    mouthFullness: 43, mouthWidth: 60, mouthHeight: 42
  },
  { 
    id: 'f35', gender: 'female', age: 32, 
    skinColor: '#e0ac69', hairColor: '#94a3b8', eyeColor: '#166534',
    hairStyle: 'wavy', eyeStyle: 'sunglasses', noseStyle: 'broad', mouthStyle: 'laugh',
    clothesStyle: 'kimono', clothesColor: '#ffffff', bgTheme: 'light',
    headwear: 'turban',
    faceWidth: 49, eyeSize: 44, eyeAngle: 40, eyeDistance: 52, eyelidHeight: 56,
    upperLashes: 'none', lowerLashes: 'long', noseWidth: 48, noseHeight: 59, noseAngle: 54, noseTipSize: 51,
    mouthFullness: 54, mouthWidth: 44, mouthHeight: 47
  },
  { 
    id: 'f36', gender: 'female', age: 38, 
    skinColor: '#8d5524', hairColor: '#4a3018', eyeColor: '#166534',
    hairStyle: 'bun', eyeStyle: 'glasses', noseStyle: 'pointed', mouthStyle: 'surprised',
    clothesStyle: 'jacket', clothesColor: '#e11d48', bgTheme: 'light',
    headwear: 'sombrero',
    faceWidth: 52, eyeSize: 47, eyeAngle: 43, eyeDistance: 60, eyelidHeight: 41,
    upperLashes: 'thick', lowerLashes: 'none', noseWidth: 59, noseHeight: 57, noseAngle: 51, noseTipSize: 42,
    mouthFullness: 51, mouthWidth: 45, mouthHeight: 56
  },
  { 
    id: 'f37', gender: 'female', age: 18, 
    skinColor: '#f5cbb7', hairColor: '#0284c7', eyeColor: '#4a3018',
    hairStyle: 'short', eyeStyle: 'glasses', noseStyle: 'snub', mouthStyle: 'surprised',
    clothesStyle: 'qipao', clothesColor: '#16a34a', bgTheme: 'light',
    headwear: 'crown',
    faceWidth: 40, eyeSize: 47, eyeAngle: 52, eyeDistance: 42, eyelidHeight: 49,
    upperLashes: 'long', lowerLashes: 'long', noseWidth: 54, noseHeight: 59, noseAngle: 58, noseTipSize: 56,
    mouthFullness: 50, mouthWidth: 52, mouthHeight: 40
  },
  { 
    id: 'f38', gender: 'female', age: 28, 
    skinColor: '#e0ac69', hairColor: '#a0a0a0', eyeColor: '#9333ea',
    hairStyle: 'long', eyeStyle: 'glasses', noseStyle: 'aquiline', mouthStyle: 'open',
    clothesStyle: 'tanktop', clothesColor: '#ffffff', bgTheme: 'light',
    headwear: 'none',
    faceWidth: 59, eyeSize: 43, eyeAngle: 47, eyeDistance: 42, eyelidHeight: 58,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 58, noseHeight: 51, noseAngle: 46, noseTipSize: 53,
    mouthFullness: 53, mouthWidth: 42, mouthHeight: 46
  },
  { 
    id: 'f39', gender: 'female', age: 21, 
    skinColor: '#e0ac69', hairColor: '#a0a0a0', eyeColor: '#166534',
    hairStyle: 'bun', eyeStyle: 'sunglasses', noseStyle: 'thin', mouthStyle: 'wide',
    clothesStyle: 'military', clothesColor: '#1e293b', bgTheme: 'light',
    headwear: 'beanie',
    faceWidth: 50, eyeSize: 47, eyeAngle: 41, eyeDistance: 49, eyelidHeight: 48,
    upperLashes: 'short', lowerLashes: 'short', noseWidth: 44, noseHeight: 50, noseAngle: 45, noseTipSize: 57,
    mouthFullness: 55, mouthWidth: 42, mouthHeight: 54
  },
  { 
    id: 'f40', gender: 'female', age: 48, 
    skinColor: '#8d5524', hairColor: '#a53814', eyeColor: '#0284c7',
    hairStyle: 'short', eyeStyle: 'normal', noseStyle: 'broad', mouthStyle: 'smirk',
    clothesStyle: 'cyberpunk', clothesColor: '#16a34a', bgTheme: 'light',
    headwear: 'crown',
    faceWidth: 55, eyeSize: 56, eyeAngle: 53, eyeDistance: 60, eyelidHeight: 52,
    upperLashes: 'long', lowerLashes: 'none', noseWidth: 45, noseHeight: 54, noseAngle: 58, noseTipSize: 51,
    mouthFullness: 60, mouthWidth: 49, mouthHeight: 59
  },
  { 
    id: 'f41', gender: 'female', age: 26, 
    skinColor: '#3d2210', hairColor: '#0284c7', eyeColor: '#9333ea',
    hairStyle: 'afro', eyeStyle: 'glasses', noseStyle: 'pointed', mouthStyle: 'pout',
    clothesStyle: 'police', clothesColor: '#16a34a', bgTheme: 'light',
    headwear: 'turban',
    faceWidth: 52, eyeSize: 43, eyeAngle: 49, eyeDistance: 43, eyelidHeight: 41,
    upperLashes: 'short', lowerLashes: 'short', noseWidth: 43, noseHeight: 50, noseAngle: 51, noseTipSize: 57,
    mouthFullness: 55, mouthWidth: 45, mouthHeight: 54
  },
  { 
    id: 'f42', gender: 'female', age: 41, 
    skinColor: '#f5cbb7', hairColor: '#0284c7', eyeColor: '#9333ea',
    hairStyle: 'wavy', eyeStyle: 'glasses', noseStyle: 'wide', mouthStyle: 'pout',
    clothesStyle: 'wizard', clothesColor: '#e11d48', bgTheme: 'light',
    headwear: 'hijab',
    faceWidth: 47, eyeSize: 60, eyeAngle: 55, eyeDistance: 49, eyelidHeight: 50,
    upperLashes: 'none', lowerLashes: 'none', noseWidth: 59, noseHeight: 58, noseAngle: 42, noseTipSize: 40,
    mouthFullness: 43, mouthWidth: 52, mouthHeight: 40
  },
  { 
    id: 'f43', gender: 'female', age: 34, 
    skinColor: '#f5cbb7', hairColor: '#94a3b8', eyeColor: '#4a3018',
    hairStyle: 'curly', eyeStyle: 'glasses', noseStyle: 'button', mouthStyle: 'smirk',
    clothesStyle: 'kilt', clothesColor: '#e11d48', bgTheme: 'light',
    headwear: 'turban',
    faceWidth: 54, eyeSize: 48, eyeAngle: 53, eyeDistance: 60, eyelidHeight: 45,
    upperLashes: 'short', lowerLashes: 'short', noseWidth: 53, noseHeight: 46, noseAngle: 47, noseTipSize: 43,
    mouthFullness: 58, mouthWidth: 46, mouthHeight: 42
  },
  { 
    id: 'f44', gender: 'female', age: 53, 
    skinColor: '#f5cbb7', hairColor: '#e8c37a', eyeColor: '#4a3018',
    hairStyle: 'ponytail', eyeStyle: 'sunglasses', noseStyle: 'button', mouthStyle: 'smirk',
    clothesStyle: 'hanfu', clothesColor: '#eab308', bgTheme: 'light',
    headwear: 'cowboy',
    faceWidth: 44, eyeSize: 42, eyeAngle: 51, eyeDistance: 50, eyelidHeight: 48,
    upperLashes: 'short', lowerLashes: 'long', noseWidth: 50, noseHeight: 52, noseAngle: 54, noseTipSize: 50,
    mouthFullness: 48, mouthWidth: 40, mouthHeight: 45
  },
  { 
    id: 'f45', gender: 'female', age: 40, 
    skinColor: '#e0ac69', hairColor: '#e8c37a', eyeColor: '#166534',
    hairStyle: 'wavy', eyeStyle: 'sunglasses', noseStyle: 'button', mouthStyle: 'sad',
    clothesStyle: 'construction', clothesColor: '#eab308', bgTheme: 'light',
    headwear: 'sombrero',
    faceWidth: 55, eyeSize: 47, eyeAngle: 57, eyeDistance: 51, eyelidHeight: 57,
    upperLashes: 'none', lowerLashes: 'none', noseWidth: 41, noseHeight: 44, noseAngle: 54, noseTipSize: 55,
    mouthFullness: 58, mouthWidth: 46, mouthHeight: 48
  },
  { 
    id: 'f46', gender: 'female', age: 56, 
    skinColor: '#ffe0d2', hairColor: '#a53814', eyeColor: '#0284c7',
    hairStyle: 'curly', eyeStyle: 'normal', noseStyle: 'aquiline', mouthStyle: 'wide',
    clothesStyle: 'sports', clothesColor: '#16a34a', bgTheme: 'light',
    headwear: 'conical',
    faceWidth: 54, eyeSize: 52, eyeAngle: 53, eyeDistance: 58, eyelidHeight: 48,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 52, noseHeight: 54, noseAngle: 54, noseTipSize: 46,
    mouthFullness: 54, mouthWidth: 50, mouthHeight: 42
  },
  { 
    id: 'f47', gender: 'female', age: 59, 
    skinColor: '#f5cbb7', hairColor: '#4a3018', eyeColor: '#166534',
    hairStyle: 'wavy', eyeStyle: 'glasses', noseStyle: 'pointed', mouthStyle: 'smirk',
    clothesStyle: 'hanfu', clothesColor: '#eab308', bgTheme: 'light',
    headwear: 'sombrero',
    faceWidth: 52, eyeSize: 48, eyeAngle: 58, eyeDistance: 55, eyelidHeight: 54,
    upperLashes: 'none', lowerLashes: 'none', noseWidth: 48, noseHeight: 53, noseAngle: 57, noseTipSize: 46,
    mouthFullness: 45, mouthWidth: 55, mouthHeight: 44
  },
  { 
    id: 'f48', gender: 'female', age: 35, 
    skinColor: '#3d2210', hairColor: '#a53814', eyeColor: '#0284c7',
    hairStyle: 'ponytail', eyeStyle: 'glasses', noseStyle: 'aquiline', mouthStyle: 'open',
    clothesStyle: 'astronaut', clothesColor: '#0055FF', bgTheme: 'light',
    headwear: 'crown',
    faceWidth: 46, eyeSize: 57, eyeAngle: 51, eyeDistance: 43, eyelidHeight: 49,
    upperLashes: 'none', lowerLashes: 'short', noseWidth: 41, noseHeight: 58, noseAngle: 47, noseTipSize: 59,
    mouthFullness: 46, mouthWidth: 42, mouthHeight: 60
  },
  { 
    id: 'm25', gender: 'male', age: 20, 
    skinColor: '#e0ac69', hairColor: '#e11d48', eyeColor: '#166534',
    hairStyle: 'spiky', eyeStyle: 'sunglasses', noseStyle: 'button', mouthStyle: 'surprised',
    clothesStyle: 'kilt', clothesColor: '#e11d48', bgTheme: 'light',
    headwear: 'headband',
    facialHairStyle: 'none', facialHairColor: '#a0a0a0',
    faceWidth: 59, eyeSize: 49, eyeAngle: 60, eyeDistance: 42, eyelidHeight: 57,
    upperLashes: 'long', lowerLashes: 'long', noseWidth: 46, noseHeight: 47, noseAngle: 41, noseTipSize: 43,
    mouthFullness: 46, mouthWidth: 59, mouthHeight: 60
  },
  { 
    id: 'm26', gender: 'male', age: 65, 
    skinColor: '#3d2210', hairColor: '#94a3b8', eyeColor: '#4a3018',
    hairStyle: 'spiky', eyeStyle: 'glasses', noseStyle: 'snub', mouthStyle: 'neutral',
    clothesStyle: 'kimono', clothesColor: '#ffffff', bgTheme: 'light',
    headwear: 'headband',
    facialHairStyle: 'goatee', facialHairColor: '#a0a0a0',
    faceWidth: 56, eyeSize: 50, eyeAngle: 48, eyeDistance: 40, eyelidHeight: 44,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 49, noseHeight: 59, noseAngle: 60, noseTipSize: 46,
    mouthFullness: 57, mouthWidth: 55, mouthHeight: 46
  },
  { 
    id: 'm27', gender: 'male', age: 28, 
    skinColor: '#ffe0d2', hairColor: '#a53814', eyeColor: '#166534',
    hairStyle: 'fade', eyeStyle: 'sunglasses', noseStyle: 'button', mouthStyle: 'sad',
    clothesStyle: 'hoodie', clothesColor: '#1e293b', bgTheme: 'light',
    headwear: 'cap',
    facialHairStyle: 'mustache', facialHairColor: '#e8c37a',
    faceWidth: 51, eyeSize: 48, eyeAngle: 46, eyeDistance: 56, eyelidHeight: 60,
    upperLashes: 'long', lowerLashes: 'long', noseWidth: 49, noseHeight: 58, noseAngle: 47, noseTipSize: 54,
    mouthFullness: 47, mouthWidth: 51, mouthHeight: 51
  },
  { 
    id: 'm28', gender: 'male', age: 59, 
    skinColor: '#e0ac69', hairColor: '#e8c37a', eyeColor: '#4a3018',
    hairStyle: 'fade', eyeStyle: 'sunglasses', noseStyle: 'broad', mouthStyle: 'pout',
    clothesStyle: 'royal', clothesColor: '#1e293b', bgTheme: 'light',
    headwear: 'none',
    facialHairStyle: 'none', facialHairColor: '#94a3b8',
    faceWidth: 56, eyeSize: 43, eyeAngle: 47, eyeDistance: 58, eyelidHeight: 42,
    upperLashes: 'short', lowerLashes: 'long', noseWidth: 54, noseHeight: 50, noseAngle: 42, noseTipSize: 51,
    mouthFullness: 44, mouthWidth: 51, mouthHeight: 51
  },
  { 
    id: 'm29', gender: 'male', age: 62, 
    skinColor: '#e0ac69', hairColor: '#e11d48', eyeColor: '#0284c7',
    hairStyle: 'spiky', eyeStyle: 'sunglasses', noseStyle: 'aquiline', mouthStyle: 'open',
    clothesStyle: 'wizard', clothesColor: '#e11d48', bgTheme: 'light',
    headwear: 'cowboy',
    facialHairStyle: 'goatee', facialHairColor: '#a0a0a0',
    faceWidth: 48, eyeSize: 48, eyeAngle: 44, eyeDistance: 58, eyelidHeight: 52,
    upperLashes: 'long', lowerLashes: 'none', noseWidth: 54, noseHeight: 41, noseAngle: 46, noseTipSize: 44,
    mouthFullness: 46, mouthWidth: 53, mouthHeight: 59
  },
  { 
    id: 'm30', gender: 'male', age: 45, 
    skinColor: '#f5cbb7', hairColor: '#e11d48', eyeColor: '#0284c7',
    hairStyle: 'mohawk', eyeStyle: 'glasses', noseStyle: 'small', mouthStyle: 'neutral',
    clothesStyle: 'qipao', clothesColor: '#0055FF', bgTheme: 'light',
    headwear: 'crown',
    facialHairStyle: 'stubble', facialHairColor: '#1a1a1a',
    faceWidth: 48, eyeSize: 53, eyeAngle: 47, eyeDistance: 46, eyelidHeight: 58,
    upperLashes: 'thick', lowerLashes: 'none', noseWidth: 58, noseHeight: 56, noseAngle: 48, noseTipSize: 56,
    mouthFullness: 42, mouthWidth: 43, mouthHeight: 41
  },
  { 
    id: 'm31', gender: 'male', age: 49, 
    skinColor: '#3d2210', hairColor: '#a0a0a0', eyeColor: '#9333ea',
    hairStyle: 'short', eyeStyle: 'normal', noseStyle: 'broad', mouthStyle: 'sad',
    clothesStyle: 'construction', clothesColor: '#16a34a', bgTheme: 'light',
    headwear: 'cap',
    facialHairStyle: 'mustache', facialHairColor: '#a0a0a0',
    faceWidth: 54, eyeSize: 48, eyeAngle: 40, eyeDistance: 59, eyelidHeight: 45,
    upperLashes: 'long', lowerLashes: 'long', noseWidth: 45, noseHeight: 48, noseAngle: 54, noseTipSize: 43,
    mouthFullness: 44, mouthWidth: 54, mouthHeight: 58
  },
  { 
    id: 'm32', gender: 'male', age: 33, 
    skinColor: '#ffe0d2', hairColor: '#a0a0a0', eyeColor: '#1a1a1a',
    hairStyle: 'mohawk', eyeStyle: 'sunglasses', noseStyle: 'thin', mouthStyle: 'smile',
    clothesStyle: 'royal', clothesColor: '#eab308', bgTheme: 'light',
    headwear: 'turban',
    facialHairStyle: 'beard', facialHairColor: '#1a1a1a',
    faceWidth: 60, eyeSize: 49, eyeAngle: 59, eyeDistance: 60, eyelidHeight: 54,
    upperLashes: 'short', lowerLashes: 'short', noseWidth: 41, noseHeight: 55, noseAngle: 43, noseTipSize: 60,
    mouthFullness: 44, mouthWidth: 57, mouthHeight: 49
  },
  { 
    id: 'm33', gender: 'male', age: 63, 
    skinColor: '#f5cbb7', hairColor: '#1a1a1a', eyeColor: '#4a3018',
    hairStyle: 'spiky', eyeStyle: 'sunglasses', noseStyle: 'pointed', mouthStyle: 'pout',
    clothesStyle: 'hanfu', clothesColor: '#e11d48', bgTheme: 'light',
    headwear: 'conical',
    facialHairStyle: 'none', facialHairColor: '#e11d48',
    faceWidth: 47, eyeSize: 53, eyeAngle: 45, eyeDistance: 57, eyelidHeight: 50,
    upperLashes: 'none', lowerLashes: 'long', noseWidth: 53, noseHeight: 41, noseAngle: 55, noseTipSize: 49,
    mouthFullness: 55, mouthWidth: 54, mouthHeight: 57
  },
  { 
    id: 'm34', gender: 'male', age: 29, 
    skinColor: '#3d2210', hairColor: '#4a3018', eyeColor: '#166534',
    hairStyle: 'buzzcut', eyeStyle: 'sunglasses', noseStyle: 'flat', mouthStyle: 'sad',
    clothesStyle: 'dirndl', clothesColor: '#eab308', bgTheme: 'light',
    headwear: 'crown',
    facialHairStyle: 'beard', facialHairColor: '#1a1a1a',
    faceWidth: 50, eyeSize: 58, eyeAngle: 52, eyeDistance: 52, eyelidHeight: 43,
    upperLashes: 'none', lowerLashes: 'long', noseWidth: 51, noseHeight: 43, noseAngle: 56, noseTipSize: 52,
    mouthFullness: 40, mouthWidth: 52, mouthHeight: 46
  },
  { 
    id: 'm35', gender: 'male', age: 65, 
    skinColor: '#f5cbb7', hairColor: '#0284c7', eyeColor: '#4a3018',
    hairStyle: 'short', eyeStyle: 'glasses', noseStyle: 'flat', mouthStyle: 'laugh',
    clothesStyle: 'tshirt', clothesColor: '#1e293b', bgTheme: 'light',
    headwear: 'turban',
    facialHairStyle: 'beard', facialHairColor: '#94a3b8',
    faceWidth: 52, eyeSize: 58, eyeAngle: 56, eyeDistance: 58, eyelidHeight: 40,
    upperLashes: 'thick', lowerLashes: 'short', noseWidth: 50, noseHeight: 48, noseAngle: 55, noseTipSize: 42,
    mouthFullness: 54, mouthWidth: 59, mouthHeight: 47
  },
  { 
    id: 'm36', gender: 'male', age: 40, 
    skinColor: '#e0ac69', hairColor: '#e8c37a', eyeColor: '#9333ea',
    hairStyle: 'fade', eyeStyle: 'normal', noseStyle: 'snub', mouthStyle: 'laugh',
    clothesStyle: 'vneck', clothesColor: '#16a34a', bgTheme: 'light',
    headwear: 'headband',
    facialHairStyle: 'goatee', facialHairColor: '#e8c37a',
    faceWidth: 48, eyeSize: 40, eyeAngle: 45, eyeDistance: 50, eyelidHeight: 40,
    upperLashes: 'long', lowerLashes: 'long', noseWidth: 60, noseHeight: 49, noseAngle: 47, noseTipSize: 55,
    mouthFullness: 41, mouthWidth: 59, mouthHeight: 58
  },
  { 
    id: 'm37', gender: 'male', age: 38, 
    skinColor: '#3d2210', hairColor: '#e8c37a', eyeColor: '#166534',
    hairStyle: 'dreadlocks', eyeStyle: 'normal', noseStyle: 'flat', mouthStyle: 'sad',
    clothesStyle: 'police', clothesColor: '#0055FF', bgTheme: 'light',
    headwear: 'turban',
    facialHairStyle: 'stubble', facialHairColor: '#e11d48',
    faceWidth: 51, eyeSize: 50, eyeAngle: 46, eyeDistance: 44, eyelidHeight: 45,
    upperLashes: 'long', lowerLashes: 'long', noseWidth: 57, noseHeight: 52, noseAngle: 41, noseTipSize: 49,
    mouthFullness: 52, mouthWidth: 51, mouthHeight: 52
  },
  { 
    id: 'm38', gender: 'male', age: 43, 
    skinColor: '#3d2210', hairColor: '#e8c37a', eyeColor: '#1a1a1a',
    hairStyle: 'dreadlocks', eyeStyle: 'sunglasses', noseStyle: 'broad', mouthStyle: 'smile',
    clothesStyle: 'hanfu', clothesColor: '#ffffff', bgTheme: 'light',
    headwear: 'headband',
    facialHairStyle: 'goatee', facialHairColor: '#a53814',
    faceWidth: 52, eyeSize: 40, eyeAngle: 60, eyeDistance: 42, eyelidHeight: 45,
    upperLashes: 'short', lowerLashes: 'long', noseWidth: 48, noseHeight: 56, noseAngle: 48, noseTipSize: 53,
    mouthFullness: 60, mouthWidth: 60, mouthHeight: 60
  },
  { 
    id: 'm39', gender: 'male', age: 64, 
    skinColor: '#ffe0d2', hairColor: '#a0a0a0', eyeColor: '#4a3018',
    hairStyle: 'buzzcut', eyeStyle: 'normal', noseStyle: 'snub', mouthStyle: 'neutral',
    clothesStyle: 'sari', clothesColor: '#e11d48', bgTheme: 'light',
    headwear: 'headband',
    facialHairStyle: 'beard', facialHairColor: '#94a3b8',
    faceWidth: 42, eyeSize: 47, eyeAngle: 45, eyeDistance: 50, eyelidHeight: 42,
    upperLashes: 'long', lowerLashes: 'none', noseWidth: 56, noseHeight: 41, noseAngle: 52, noseTipSize: 48,
    mouthFullness: 48, mouthWidth: 44, mouthHeight: 47
  },
  { 
    id: 'm40', gender: 'male', age: 30, 
    skinColor: '#3d2210', hairColor: '#e8c37a', eyeColor: '#4a3018',
    hairStyle: 'fade', eyeStyle: 'normal', noseStyle: 'pointed', mouthStyle: 'laugh',
    clothesStyle: 'hanfu', clothesColor: '#1e293b', bgTheme: 'light',
    headwear: 'cowboy',
    facialHairStyle: 'mustache', facialHairColor: '#e11d48',
    faceWidth: 42, eyeSize: 48, eyeAngle: 60, eyeDistance: 53, eyelidHeight: 54,
    upperLashes: 'thick', lowerLashes: 'short', noseWidth: 50, noseHeight: 58, noseAngle: 47, noseTipSize: 47,
    mouthFullness: 42, mouthWidth: 57, mouthHeight: 42
  },
  { 
    id: 'm41', gender: 'male', age: 21, 
    skinColor: '#f5cbb7', hairColor: '#e8c37a', eyeColor: '#0284c7',
    hairStyle: 'short', eyeStyle: 'glasses', noseStyle: 'broad', mouthStyle: 'surprised',
    clothesStyle: 'farmer', clothesColor: '#ffffff', bgTheme: 'light',
    headwear: 'cap',
    facialHairStyle: 'none', facialHairColor: '#e11d48',
    faceWidth: 52, eyeSize: 50, eyeAngle: 51, eyeDistance: 43, eyelidHeight: 52,
    upperLashes: 'thick', lowerLashes: 'short', noseWidth: 40, noseHeight: 45, noseAngle: 45, noseTipSize: 40,
    mouthFullness: 58, mouthWidth: 46, mouthHeight: 40
  },
  { 
    id: 'm42', gender: 'male', age: 27, 
    skinColor: '#3d2210', hairColor: '#1a1a1a', eyeColor: '#4a3018',
    hairStyle: 'spiky', eyeStyle: 'normal', noseStyle: 'pointed', mouthStyle: 'neutral',
    clothesStyle: 'poncho', clothesColor: '#ffffff', bgTheme: 'light',
    headwear: 'turban',
    facialHairStyle: 'goatee', facialHairColor: '#a53814',
    faceWidth: 57, eyeSize: 51, eyeAngle: 50, eyeDistance: 48, eyelidHeight: 55,
    upperLashes: 'short', lowerLashes: 'long', noseWidth: 48, noseHeight: 46, noseAngle: 42, noseTipSize: 53,
    mouthFullness: 54, mouthWidth: 56, mouthHeight: 46
  },
  { 
    id: 'm43', gender: 'male', age: 27, 
    skinColor: '#3d2210', hairColor: '#e11d48', eyeColor: '#9333ea',
    hairStyle: 'fade', eyeStyle: 'sunglasses', noseStyle: 'wide', mouthStyle: 'pout',
    clothesStyle: 'tshirt', clothesColor: '#0055FF', bgTheme: 'light',
    headwear: 'none',
    facialHairStyle: 'none', facialHairColor: '#0284c7',
    faceWidth: 40, eyeSize: 59, eyeAngle: 55, eyeDistance: 45, eyelidHeight: 55,
    upperLashes: 'long', lowerLashes: 'short', noseWidth: 52, noseHeight: 58, noseAngle: 54, noseTipSize: 46,
    mouthFullness: 60, mouthWidth: 53, mouthHeight: 54
  },
  { 
    id: 'm44', gender: 'male', age: 24, 
    skinColor: '#ffe0d2', hairColor: '#4a3018', eyeColor: '#1a1a1a',
    hairStyle: 'spiky', eyeStyle: 'glasses', noseStyle: 'flat', mouthStyle: 'sad',
    clothesStyle: 'sari', clothesColor: '#0055FF', bgTheme: 'light',
    headwear: 'crown',
    facialHairStyle: 'mustache', facialHairColor: '#a0a0a0',
    faceWidth: 52, eyeSize: 46, eyeAngle: 42, eyeDistance: 52, eyelidHeight: 57,
    upperLashes: 'long', lowerLashes: 'long', noseWidth: 51, noseHeight: 57, noseAngle: 41, noseTipSize: 46,
    mouthFullness: 49, mouthWidth: 40, mouthHeight: 56
  },
  { 
    id: 'm45', gender: 'male', age: 42, 
    skinColor: '#e0ac69', hairColor: '#a0a0a0', eyeColor: '#166534',
    hairStyle: 'mohawk', eyeStyle: 'glasses', noseStyle: 'small', mouthStyle: 'pout',
    clothesStyle: 'turtleneck', clothesColor: '#0055FF', bgTheme: 'light',
    headwear: 'hijab',
    facialHairStyle: 'none', facialHairColor: '#a0a0a0',
    faceWidth: 40, eyeSize: 41, eyeAngle: 52, eyeDistance: 56, eyelidHeight: 42,
    upperLashes: 'short', lowerLashes: 'none', noseWidth: 52, noseHeight: 46, noseAngle: 58, noseTipSize: 40,
    mouthFullness: 45, mouthWidth: 52, mouthHeight: 42
  },
  { 
    id: 'm46', gender: 'male', age: 49, 
    skinColor: '#3d2210', hairColor: '#a53814', eyeColor: '#4a3018',
    hairStyle: 'bald', eyeStyle: 'glasses', noseStyle: 'button', mouthStyle: 'laugh',
    clothesStyle: 'qipao', clothesColor: '#0055FF', bgTheme: 'light',
    headwear: 'beanie',
    facialHairStyle: 'mustache', facialHairColor: '#e11d48',
    faceWidth: 40, eyeSize: 53, eyeAngle: 51, eyeDistance: 56, eyelidHeight: 49,
    upperLashes: 'thick', lowerLashes: 'short', noseWidth: 59, noseHeight: 56, noseAngle: 40, noseTipSize: 49,
    mouthFullness: 45, mouthWidth: 49, mouthHeight: 48
  },
  { 
    id: 'm47', gender: 'male', age: 54, 
    skinColor: '#3d2210', hairColor: '#a0a0a0', eyeColor: '#0284c7',
    hairStyle: 'mohawk', eyeStyle: 'glasses', noseStyle: 'wide', mouthStyle: 'smile',
    clothesStyle: 'cyberpunk', clothesColor: '#0055FF', bgTheme: 'light',
    headwear: 'headband',
    facialHairStyle: 'mustache', facialHairColor: '#a53814',
    faceWidth: 48, eyeSize: 44, eyeAngle: 54, eyeDistance: 58, eyelidHeight: 54,
    upperLashes: 'thick', lowerLashes: 'long', noseWidth: 45, noseHeight: 55, noseAngle: 60, noseTipSize: 51,
    mouthFullness: 58, mouthWidth: 40, mouthHeight: 59
  },
  { 
    id: 'm48', gender: 'male', age: 47, 
    skinColor: '#f5cbb7', hairColor: '#e8c37a', eyeColor: '#166534',
    hairStyle: 'mohawk', eyeStyle: 'sunglasses', noseStyle: 'small', mouthStyle: 'smirk',
    clothesStyle: 'sports', clothesColor: '#0055FF', bgTheme: 'light',
    headwear: 'headband',
    facialHairStyle: 'mustache', facialHairColor: '#94a3b8',
    faceWidth: 54, eyeSize: 54, eyeAngle: 54, eyeDistance: 47, eyelidHeight: 47,
    upperLashes: 'thick', lowerLashes: 'none', noseWidth: 42, noseHeight: 49, noseAngle: 46, noseTipSize: 41,
    mouthFullness: 48, mouthWidth: 54, mouthHeight: 54
  },
];

const femaleNames = ['Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Aisha', 'Mei', 'Yuki', 'Fatima', 'Sofia', 'Chloe', 'Zoe', 'Lily', 'Aria', 'Nora', 'Layla', 'Mila', 'Eleanor', 'Hannah', 'Lillian', 'Addison', 'Aubrey', 'Ellie', 'Stella', 'Natalie', 'Leah', 'Hazel', 'Violet', 'Aurora', 'Savannah', 'Audrey', 'Brooklyn', 'Bella', 'Claire', 'Skylar', 'Lucy', 'Paisley', 'Everly', 'Anna', 'Caroline', 'Nova', 'Genesis', 'Emilia', 'Kennedy', 'Samantha'];
const maleNames = ['Liam', 'Noah', 'William', 'James', 'Oliver', 'Benjamin', 'Elijah', 'Lucas', 'Mason', 'Logan', 'Omar', 'Kenji', 'Wei', 'Tariq', 'Mateo', 'Leo', 'Jack', 'Luke', 'Jayden', 'Dylan', 'Alexander', 'Ethan', 'Jacob', 'Michael', 'Daniel', 'Henry', 'Jackson', 'Sebastian', 'Aiden', 'Matthew', 'Samuel', 'David', 'Joseph', 'Carter', 'Owen', 'Wyatt', 'John', 'Grayson', 'Levi', 'Isaac', 'Gabriel', 'Julian', 'Anthony', 'Jaxon', 'Lincoln', 'Joshua', 'Christopher', 'Andrew', 'Theodore', 'Caleb'];

const extraKeywords = [
  'engineer', 'cooking', 'teacher', 'dancer', 'singer', 'farmer', 'driver', 'joker', 
  'basketball player', 'soccer player', 'fisher', 'runner', 'hiker', 'AI engineer', 
  'database engineer', 'robotic engineer', 'doctor', 'chef', 'police', 'astronaut', 
  'ninja', 'wizard', 'student', 'artist', 'writer', 'musician', 'athlete', 'gamer'
];

export const avatars: AvatarConfig[] = rawAvatars.map((a, i) => {
  const nameList = a.gender === 'female' ? femaleNames : maleNames;
  // Use a pseudo-random but deterministic index based on id
  const nameIndex = parseInt(a.id.replace(/\D/g, '')) || i;
  const name = nameList[nameIndex % nameList.length];
  
  // Assign 2 deterministic extra keywords per avatar
  const extra1 = extraKeywords[i % extraKeywords.length];
  const extra2 = extraKeywords[(i * 3 + 7) % extraKeywords.length];

  const keywords = [
    a.clothesStyle, 
    a.hairStyle, 
    a.gender, 
    a.age.toString(), 
    a.headwear && a.headwear !== 'none' ? a.headwear : '',
    a.facialHairStyle && a.facialHairStyle !== 'none' ? a.facialHairStyle : '',
    a.eyeStyle && a.eyeStyle !== 'normal' ? a.eyeStyle : '',
    extra1,
    extra2
  ].filter(Boolean) as string[];

  return { ...a, name, keywords };
});
