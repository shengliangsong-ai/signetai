
export enum SignetEntityType {
  MODEL = 'MODEL',
  TOOL = 'TOOL',
  HUMAN = 'HUMAN'
}

export interface SignetPayload {
  version: string;
  timestamp: number;
  entityId: string;
  entityType: SignetEntityType;
  inputHash: string;
  outputHash: string;
  signature: string;
}

export interface TrustKeyRecord {
  id: string;
  ownerId: string;
  publicKey: string;
  provider: 'SIGNET' | 'GOOGLE' | 'DEEPSEEK';
  status: 'ACTIVE' | 'REVOKED';
  createdAt: Date;
}

export interface NeuralRetinaNode {
  id: string;
  bookId: string;
  contentHash: string;
  dependencies: string[]; // List of other node IDs
  verifiedBy: string; // Master Signet ID
  symbolicParityScore: number;
}
