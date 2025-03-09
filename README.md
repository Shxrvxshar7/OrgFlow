# Employee Organization Chart 
LINK: https://org-flow-xi.vercel.app/

An interactive web application for visualizing and managing an employee organization chart with drag-and-drop functionality.

## Features

- View employee organization hierarchy in a tree-like chart
- Search for employees by name, designation, or team
- Filter employees by team
- Drag and drop employees to change their manager
- Interactive UI with a soft pastel palette
- Responsive design for various screen sizes

## Technologies Used

- React
- Vite
- MirageJS (for API mocking)
- React Organizational Chart
- React Beautiful DnD
- Styled Components

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Usage

### Employee List

- The left sidebar displays a list of all employees
- Use the search box to find employees by name, designation, or team
- Use the dropdown to filter employees by team

### Organization Chart

- The main content area displays the organization chart
- Drag an employee card and drop it onto another employee to change the manager
- The chart will automatically update to reflect the new hierarchy

### Adding Custom Logo

To replace the default logo:
1. Add your logo image to the `public` directory
2. Name it `logo.svg` (SVG format is recommended)

## Project Structure

- `src/components/` - React components
- `src/mirage.js` - Mock API setup with MirageJS
- `public/` - Static assets like logo and profile images
