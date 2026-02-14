
export enum SignetEntityType {
  MODEL = 'MODEL',
  TOOL = 'TOOL',
  HUMAN = 'HUMAN'
}

export enum SignetPipelineLayer {
  VISION_SUBSTRATE = 'L1: VISION_SUBSTRATE',
  NEURAL_LENS = 'L2: NEURAL_LENS',
  ADVERSARIAL_PROBE = 'L3: ADVERSARIAL_PROBE',
  HUMAN_SIGNET = 'L4: HUMAN_SIGNET'
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

export interface XSignetVPRHeader {
  version: string;
  vprScore: number;
  signatureHash: string;
  layers: {
    l1_thesis_id: string;
    l2_dag_hash: string;
    l3_logic_drift: number;
    l4_curator_sig: string;
  };
}

export interface AppSignetMapping {
  app: string;
  layer: SignetPipelineLayer;
  contribution: string;
}
