
import React from 'react';
import { Hero } from './components/Hero';
import { Architecture } from './components/Architecture';
import { SchemaDefinition } from './components/SchemaDefinition';
import { Admonition } from './components/Admonition';
import { PodcastDemo } from './components/PodcastDemo';
import { ContactHub } from './components/ContactHub';
import { MissionView } from './components/MissionView';
import { TrustKeyService } from './components/TrustKeyService';
import { ProvenanceLab } from './components/ProvenanceLab';
import { SpecView } from './components/SpecView';
import { StandardsView } from './components/StandardsView';
import { SchemaView } from './components/SchemaView';
import { BrandingView } from './components/BrandingView';
import { ManualView } from './components/ManualView';
import { ComplianceDashboard } from './components/ComplianceDashboard';
import { VerifyView } from './components/VerifyView';
import { EcosystemView } from './components/EcosystemView';
import { SvgSigner } from './components/SvgSigner';
import { PdfSigner } from './components/PdfSigner';
import { UniversalSigner } from './components/UniversalSigner';
import { ProjectStatusView } from './components/ProjectStatusView';
import { BatchVerifier } from './components/BatchVerifier';
import { CliDownload } from './components/CliDownload';
import { PrivacyView } from './components/PrivacyView';
import { DonationView } from './components/DonationView';
import { TermsOfServiceView } from './components/TermsOfServiceView';
import { UserDataDeletionView } from './components/UserDataDeletionView';
import { ImageComparator } from './components/ImageComparator';

export const HomeView: React.FC<{ onOpenPortal: () => void }> = ({ onOpenPortal }) => (
    <>
        <Hero onOpenPortal={onOpenPortal} />
        <Admonition type="note" title="Cognitive Assertion Layer">
            Signet Protocol acts as a specialized subdirectory of C2PA, mapping neural logic states into standard JUMBF manifest boxes.
        </Admonition>
        <ContactHub />
    </>
);

export const viewComponents: { [key: string]: React.FC<any> } = {
  home: HomeView,
  mission: MissionView,
  identity: TrustKeyService,
  auditor: ProvenanceLab,
  spec: SpecView,
  standards: StandardsView,
  schema: SchemaView,
  branding: BrandingView,
  manual: ManualView,
  compliance: ComplianceDashboard,
  verify: VerifyView,
  ecosystem: EcosystemView,
  'svg-lab': SvgSigner,
  'pdf-lab': PdfSigner,
  'universal-lab': UniversalSigner,
  status: ProjectStatusView,
  batch: BatchVerifier,
  cli: CliDownload,
  privacy: PrivacyView,
  donate: DonationView,
  terms: TermsOfServiceView,
  'data-deletion': UserDataDeletionView,
  'image-comparator-demo': ImageComparator,
};

export const pathRoutes: { [key: string]: string } = {
    '/': 'home',
    '/mission': 'mission',
    '/auditor': 'auditor',
    '/identity': 'identity',
    '/spec': 'spec',
    '/standards': 'standards',
    '/schema': 'schema',
    '/branding': 'branding',
    '/manual': 'manual',
    '/compliance': 'compliance',
    '/verify': 'verify',
    '/ecosystem': 'ecosystem',
    '/svg-lab': 'svg-lab',
    '/pdf-lab': 'pdf-lab',
    '/universal-lab': 'universal-lab',
    '/status': 'status',
    '/batch': 'batch',
    '/cli': 'cli',
    '/privacy': 'privacy',
    '/donate': 'donate',
    '/terms': 'terms',
    '/data-deletion': 'data-deletion',
    '/image-comparator-demo': 'image-comparator-demo',
};
