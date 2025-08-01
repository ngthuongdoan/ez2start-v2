# Directory Structure
This document outlines the structure of the ez2start-v2 project, focusing on the components and settings related to the application.
# Directory Structure Overview
The Next.js app directory is structured to support the development of scalable and maintainable applications. Below is an overview of the typical directory structure:
- `app/`: Contains the application pages and layout components.
- `components/`: Reusable UI components used across the application.
- `containers/`: Feature-specific components or modules.
- `pages/`: Legacy routing and SEO-related pages.
- `public/`: Static assets such as images, fonts, and other files.
- `styles/`: Global and modular CSS or SCSS files.
- `utils/`: Utility functions and helpers.
- `hooks/`: Custom React hooks for shared logic.
- `context/`: Context providers for managing global state.
- `lib/`: External libraries or API integrations.
- `tests/`: Unit and integration tests for the application.
- `config/`: Configuration files for the application.
- `middleware/`: Middleware functions for handling requests.

# Coding Guide for ez2start-v2
- Use descriptive names for components and files to enhance readability.
- Maintain a clear separation of concerns, with each component handling its own logic and presentation.
- Use TypeScript for type safety and better developer experience.
- Ensure that all components are responsive and accessible.
- Use Mantine's Grid and Stack components for layout consistency.
- Use the `Paper` component for section containers to maintain a consistent look and feel.
- Use `Select` components for dropdowns and options, ensuring that the data is well-defined and consistent across the application.
- Use `Title` components for headings, ensuring they are appropriately sized and styled.
- Ensure that all components are imported and exported correctly in the index file for easy access.
- Use `useCallback` and `useEffect` hooks for managing component state and side effects
to ensure optimal performance and avoid unnecessary re-renders.
- Ensure that all components are properly typed with TypeScript interfaces or types.
- Use `mantine/core` components for consistent styling and functionality across the application.
- Ensure that all components are tested for functionality and appearance.
- Use `Grid` components for layout, ensuring that the application is responsive and well-structured.
- Use `ScrollArea` components for sections that may require scrolling, ensuring a smooth user experience.
- Use `Stack` components for vertical spacing between elements, ensuring a clean and organized layout.
- When creating new pages, ensure that it is added to the appropriate directory under `containers`, `pages` is for SEO and layout wrapper only.
- Each `pages` or `containers` directory should have its own `index.ts` file to export components for easier imports.
- When creating new components, ensure they are added to the appropriate directory and follow the naming conventions. Also add to the `index.ts` file for that directory to ensure they are exported correctly.