# Planning Guide

A web application that converts JSON files to CSV format, enabling users to upload JSON data and download the converted CSV file with a clean, intuitive interface.

**Experience Qualities**:
1. **Efficient** - The conversion process should feel instantaneous with clear feedback at every step
2. **Reliable** - Users should trust that their data is being converted accurately without loss
3. **Clear** - The interface should make the process obvious: upload, preview, download

**Complexity Level**: Light Application (multiple features with basic state)
  - The app handles file upload, JSON parsing, CSV conversion, data preview, and file download with proper error handling and state management.

## Essential Features

### File Upload
- **Functionality**: Accept JSON files via drag-and-drop or file picker
- **Purpose**: Provides flexible input methods for user convenience
- **Trigger**: User drags file onto upload zone or clicks to browse
- **Progression**: Upload zone → File selected → JSON parsed → Preview displayed
- **Success criteria**: File successfully parsed and content displayed in preview

### JSON to CSV Conversion
- **Functionality**: Automatically converts uploaded JSON to CSV format
- **Purpose**: Core feature that transforms data structure from JSON to tabular format
- **Trigger**: Successful JSON file upload and parsing
- **Progression**: JSON parsed → Flattened to rows/columns → CSV format generated → Preview updated
- **Success criteria**: JSON structure accurately represented in CSV format with proper escaping

### Data Preview
- **Functionality**: Display both JSON input and CSV output in readable format
- **Purpose**: Allows users to verify conversion accuracy before downloading
- **Trigger**: File successfully uploaded and converted
- **Progression**: Conversion complete → Data rendered in preview panels → User reviews
- **Success criteria**: Both formats clearly visible and scrollable

### CSV Download
- **Functionality**: Export converted CSV file to user's device
- **Purpose**: Delivers the converted result to the user
- **Trigger**: User clicks download button
- **Progression**: Download button clicked → CSV file generated → Browser download initiated
- **Success criteria**: CSV file downloads with proper formatting and filename

### Error Handling
- **Functionality**: Detect and display errors for invalid JSON or conversion issues
- **Purpose**: Guide users to fix issues with their input data
- **Trigger**: Invalid file type, malformed JSON, or conversion error
- **Progression**: Error detected → Clear message displayed → User can retry
- **Success criteria**: Users understand what went wrong and how to fix it

## Edge Case Handling
- **Invalid JSON**: Display specific error message with line number if possible
- **Empty files**: Show friendly message prompting user to upload valid content
- **Nested JSON structures**: Flatten nested objects with dot notation (e.g., user.name)
- **Array of primitives**: Wrap in single column format
- **Mixed data types**: Handle arrays of objects with varying keys by including all columns
- **Large files**: Show loading indicator during processing
- **Special characters**: Properly escape commas, quotes, and newlines in CSV output

## Design Direction
The design should feel professional and efficient, like a developer tool that prioritizes function over form while maintaining visual clarity and a clean aesthetic that inspires confidence in data handling accuracy.

## Color Selection
Custom palette with a technical, professional feel emphasizing trust and clarity.

- **Primary Color**: Deep Blue (oklch(0.45 0.15 250)) - Communicates reliability and technical precision
- **Secondary Colors**: Neutral grays for backgrounds and supporting UI elements
- **Accent Color**: Vibrant Teal (oklch(0.65 0.15 195)) - Draws attention to CTAs and success states
- **Foreground/Background Pairings**:
  - Background (Light Gray oklch(0.98 0 0)): Dark text oklch(0.2 0 0) - Ratio 14.8:1 ✓
  - Card (White oklch(1 0 0)): Dark text oklch(0.2 0 0) - Ratio 16.2:1 ✓
  - Primary (Deep Blue oklch(0.45 0.15 250)): White text oklch(1 0 0) - Ratio 7.2:1 ✓
  - Secondary (Light Gray oklch(0.95 0 0)): Dark text oklch(0.25 0 0) - Ratio 11.5:1 ✓
  - Accent (Vibrant Teal oklch(0.65 0.15 195)): White text oklch(1 0 0) - Ratio 4.8:1 ✓
  - Muted (Soft Gray oklch(0.96 0 0)): Medium text oklch(0.5 0 0) - Ratio 7.1:1 ✓

## Font Selection
Use Inter for its excellent readability at all sizes and modern, technical appearance that suits a developer-focused tool.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold/32px/tight letter-spacing (-0.02em)
  - H2 (Section Headers): Inter Semibold/20px/normal letter-spacing
  - Body (Instructions & Labels): Inter Regular/15px/relaxed line-height (1.6)
  - Code/Data Preview: SF Mono/13px/monospace for JSON and CSV display
  - Buttons: Inter Medium/14px/slight letter-spacing (0.01em)

## Animations
Animations should be minimal and functional, providing feedback without distraction - subtle transitions for state changes and gentle hover effects to indicate interactivity.

- **Purposeful Meaning**: Motion reinforces the conversion flow - upload → process → download with subtle progress indicators
- **Hierarchy of Movement**: Focus animation on the upload zone (hover/drag states) and download button (success pulse), keep data previews static for readability

## Component Selection
- **Components**:
  - Card: Main container for upload zone and preview areas with subtle shadow
  - Button: Primary action for download, secondary for clear/reset
  - Alert: Error and success messages with appropriate variants
  - Separator: Visual division between JSON and CSV previews
  - ScrollArea: For preview panels to handle large datasets
  - Badge: Show file info (name, size, row count)
  
- **Customizations**:
  - Custom upload dropzone with dashed border and hover states
  - Monospace code blocks for data preview with syntax highlighting
  - Custom file input trigger styled as button
  
- **States**:
  - Upload zone: Default (dashed border), Hover (border color change), Drag-over (background highlight), Active (file loaded)
  - Buttons: Default, Hover (slight scale), Active (pressed), Disabled (when no file)
  - Preview areas: Empty state (instructions), Loading (skeleton), Populated (data display)
  
- **Icon Selection**:
  - UploadSimple: Upload zone indicator
  - DownloadSimple: Download button
  - FileCsv: CSV file type indicator
  - FileJs: JSON file type indicator  
  - Warning: Error states
  - CheckCircle: Success confirmation
  
- **Spacing**:
  - Section gaps: gap-6 (24px) between major sections
  - Card padding: p-6 (24px) for comfortable breathing room
  - Preview areas: p-4 (16px) with min-height for consistent layout
  - Button spacing: gap-2 (8px) between icon and text
  
- **Mobile**: 
  - Stack preview panels vertically on mobile (< 768px)
  - Full-width upload zone and buttons
  - Reduce card padding to p-4 on mobile
  - Scrollable preview areas with max-height constraints
