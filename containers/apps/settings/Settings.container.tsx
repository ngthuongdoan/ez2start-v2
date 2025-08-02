'use client';
import { SettingsNav } from "@/components/SettingsNav";
import { Grid, ScrollArea, Stack } from "@mantine/core";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Settings.module.css";
import { GeneralSettings, HelpSettings, PositionSettings, RoleSettings, ShiftSettings } from "./components";

type SettingContainerProps = {

}

// All available sections in order
const SettingContainer = (props: SettingContainerProps) => {
  const [activeSection, setActiveSection] = useState<string>("general");

  // Reference to the scroll area viewport
  const viewportRef = useRef<HTMLDivElement>(null);

  // Function to handle intersection observer
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id);
      }
    });
  }, []);

  // Set up intersection observer for each section
  useEffect(() => {
    if (!viewportRef.current) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root: viewportRef.current,
      rootMargin: '0px',
      threshold: 0.3, // Trigger when 30% of the section is visible
    });

    // Observe all section elements using data attributes
    const sections = document.querySelectorAll('[data-section-id]');
    sections.forEach(section => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection, viewportRef.current]);

  // Handle manual navigation
  const handleNavChange = (section: string) => {
    setActiveSection(section);

    // Find the target section using data attribute
    const targetSection = document.getElementById(section);
    if (targetSection && viewportRef.current) {
      // Set focus to the section for better keyboard navigation
      targetSection.tabIndex = -1;
      targetSection.focus({ preventScroll: true });

      // Use scrollIntoView with the viewport reference - more reliable than direct DOM manipulation
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };  // Update the URL hash when active section changes
  useEffect(() => {
    if (activeSection) {
      // Update URL hash without causing a page reload
      window.history.replaceState(null, '', `#${activeSection}`);
    }
  }, [activeSection]);

  return (
    <Grid gutter={0}>
      <Grid.Col span={{ base: 12, sm: 2 }}>
        <SettingsNav
          active={activeSection}
          onNavChange={handleNavChange}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 10 }}>
        <ScrollArea
          h="calc(100vh - 120px)"
          type="hover"
          scrollbarSize={6}
          scrollHideDelay={500}
          viewportRef={viewportRef}>
          <Stack pr="md" py="md">
            <GeneralSettings />
            <ShiftSettings />
            <RoleSettings />
            <PositionSettings />
            <HelpSettings />
          </Stack>
        </ScrollArea>
      </Grid.Col>
    </Grid>
  );
};

export { SettingContainer };
