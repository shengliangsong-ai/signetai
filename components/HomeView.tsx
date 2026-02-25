
import React from 'react';
import { Hero } from './Hero';
import { Architecture } from './Architecture';
import { SchemaDefinition } from './SchemaDefinition';
import { Admonition } from './Admonition';
import { PodcastDemo } from './PodcastDemo';
import { ContactHub } from './ContactHub';

export const HomeView: React.FC<{ onOpenPortal: () => void }> = ({ onOpenPortal }) => (
    <>
        <Hero onOpenPortal={onOpenPortal} />
        <Admonition type="note" title="Cognitive Assertion Layer">
            Signet Protocol acts as a specialized subdirectory of C2PA, mapping neural logic states into standard JUMBF manifest boxes.
        </Admonition>
        <Architecture />
        <hr className="hr-chapter" />
        <PodcastDemo />
        <hr className="hr-chapter" />
        <SchemaDefinition />
        <hr className="hr-chapter" />
        <ContactHub />
    </>
);
