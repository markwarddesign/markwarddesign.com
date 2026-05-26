import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Contact as ContactForm } from '../App.jsx';

export default function ContactPage() {
  const location = useLocation();
  const initial = location.state || {};
  const [selectedStage, setSelectedStage] = useState(initial.stage || '');
  const [selectedBudget, setSelectedBudget] = useState(initial.budget || '');

  useEffect(() => {
    const prev = document.title;
    document.title = 'Contact — Mark Ward';
    const meta = document.querySelector('meta[name="description"]');
    const prevMeta = meta?.getAttribute('content');
    if (meta) meta.setAttribute('content', 'Start a project with Mark Ward — websites, MVPs, and full-stack applications. One business day to reply, no exceptions.');
    return () => {
      document.title = prev;
      if (meta && prevMeta != null) meta.setAttribute('content', prevMeta);
    };
  }, []);

  return (
    <div className="pt-20 lg:pt-28">
      <ContactForm
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
        selectedBudget={selectedBudget}
        setSelectedBudget={setSelectedBudget}
      />
    </div>
  );
}
