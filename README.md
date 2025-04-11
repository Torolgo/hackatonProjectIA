Here is the updated `README.md` file based on your current project structure:


# HackatonProjectIA

HackatonProjectIA is a project combining **Go** and **JavaScript** to deliver a powerful and efficient solution for raising awareness about environmental issues through interactive content and tools.

## Features

- **Go** backend for handling server-side logic.
- **JavaScript** frontend for dynamic and interactive user experiences.
- Informative pages about environmental topics.
- A mini-game to engage users and promote eco-friendly practices.
- Responsive design for accessibility on various devices.

## Project Structure

```markdown
hackatonProjectIA/
├── css/                 # Stylesheets
│   └── style.css        # Main CSS file
├── js/                  # JavaScript files
│   └── main.js          # Main JavaScript file
├── docs/                # GitHub Pages static files
│   ├── index.html       # Main entry point for the website
│   ├── game.html        # Mini-game page
│   ├── blog.html        # Blog page
│   ├── information.html # Information page
│   ├── credits.html     # Credits page
│   └── assets/          # Images and other resources
├── src/                 # Backend source code (Go)
│   └── main.go          # Main Go application
├── .gitignore           # Ignored files and directories
├── README.md            # Project documentation
└── LICENSE              # License file
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/hackatonProjectIA.git
   cd hackatonProjectIA
   ```

2. Install dependencies for the backend (Go):
   ```bash
   go mod tidy
   ```

3. (Optional) Install dependencies for the frontend (if applicable):
   ```bash
   npm install
   ```

## Usage

1. Run the backend server:
   ```bash
   go run src/main.go
   ```

2. Open the `docs/index.html` file in your browser to view the website locally.

3. (Optional) If using a local server for the frontend, serve the `docs/` folder:
   ```bash
   npm start
   ```

## Deployment

This project is configured to be deployed using **GitHub Pages**. Ensure that the `docs/` folder contains the static files for deployment.

1. Push changes to the repository.
2. Enable GitHub Pages in the repository settings and set the source to the `docs/` folder.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## Contributors

- **[Torolgo](https://github.com/Torolgo)**  
  ![Profile Picture](https://github.com/Torolgo.png?size=100)  
  Creator and maintainer of the project.

## Acknowledgments

- Built with **Go** and **JavaScript**.
- Inspired by the need to promote environmental awareness.
- Special thanks to contributors and open-source libraries used in the project.
```