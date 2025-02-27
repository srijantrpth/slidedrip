# SlideDrip

SlideDrip is your one-stop solution to conquer your college exams, whether it is the Mid Sems or the End Sems. Just upload your PPTs in a single click and learn in an interactive way by reading flashcards and essential notes from those lengthy PPTs.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Running the Backend](#running-the-backend)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- Upload PPTs with a single click.
- Convert slides into interactive flashcards.
- Extract essential notes from PPTs.
- User-friendly interface for seamless learning.

## Installation
To run SlideDrip locally, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/srijantrpth/slidedrip.git
    ```
2. Navigate to the project directory:
    ```sh
    cd slidedrip
    ```
3. Install the required dependencies:
    ```sh
    npm install
    ```

## Usage
To start the application, run:
```sh
npm start
```
Open your browser and navigate to `http://localhost:3000` to view the application.

## Running the Backend
You can run the backend using Docker Compose or individual Dockerfiles for separate backend services.

### Using Docker Compose
To run both the Express backend and FastAPI service together:
1. Ensure Docker and Docker Compose are installed on your system.
2. Navigate to the project directory:
    ```sh
    cd slidedrip
    ```
3. Run Docker Compose:
    ```sh
    docker-compose up --build
    ```

### Using Individual Dockerfiles
To run the Express backend separately:
1. Navigate to the Express backend directory:
    ```sh
    cd backend/express-backend
    ```
2. Build the Docker image:
    ```sh
    docker build -t slidedrip_express .
    ```
3. Run the Docker container:
    ```sh
    docker run -p 5000:5000 slidedrip_express
    ```

To run the FastAPI service separately:
1. Navigate to the FastAPI service directory:
    ```sh
    cd backend/fastapi-text-service
    ```
2. Build the Docker image:
    ```sh
    docker build -t slidedrip_fastapi .
    ```
3. Run the Docker container:
    ```sh
    docker run -p 8000:8000 slidedrip_fastapi
    ```

## Contributing
Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
If you have any questions or suggestions, feel free to reach out:

- [GitHub Issues](https://github.com/srijantrpth/slidedrip/issues)

---

You can create a new README file by navigating to [this link](https://github.com/srijantrpth/slidedrip/new/main?filename=README.md) and pasting the content above.
