'use client';
import { SettingsNav } from "@/components/SettingsNav";
import { Grid } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./Settings.module.css";

type SettingContainerProps = {

}

const SettingContainer = (props: SettingContainerProps) => {
  const [activeSection, setActiveSection] = useState<string>("general");

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
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Trigger when 50% of the section is visible
    });

    // Observe all section elements
    const sections = document.querySelectorAll('div[id^="general"], div[id^="shift"], div[id^="role"], div[id^="position"], div[id^="help"]');
    sections.forEach(section => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection]);

  // Handle manual navigation
  const handleNavChange = (section: string) => {
    setActiveSection(section);
  };

  // Update the URL hash when active section changes
  useEffect(() => {
    if (activeSection) {
      // Update URL hash without causing a page reload
      window.history.replaceState(null, '', `#${activeSection}`);
    }
  }, [activeSection]);

  return (
    <Grid gutter={0}>
      <Grid.Col span={{ base: 12, sm: 4 }}>
        <SettingsNav
          active={activeSection}
          onNavChange={handleNavChange}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 8 }} className={styles.contentContainer}>
        {/* Content for each section will be displayed here */}
        <div id="general" className={styles['settings-section']}>
          <h2>General Settings</h2>
          <p>Configure general application settings here.</p>
          {/* General Settings Content */}
        </div>
        <div id="shift" className={styles['settings-section']}>
          <h2>Shift Settings</h2>
          <p>Manage employee shift configurations.</p>
          {/* Shift Settings Content */}
        </div>
        <div id="role" className={styles['settings-section']}>
          <h2>Role Management</h2>
          <p>Configure user roles and permissions.</p>
          {/* Role Settings Content */}
        </div>
        <div id="position" className={styles['settings-section']}>
          <h2>Position Settings</h2>
          <p>Manage employee positions and titles.</p>
          {/* Position Settings Content */}
        </div>
        <div id="help" className={styles['settings-section']}>
          <h2>Help & Documentation</h2>
          <p>Find answers to common questions and learn how to use the system.</p>
          {/* Help Content */}
        </div>
      </Grid.Col>
    </Grid>
  );
};

export { SettingContainer };
