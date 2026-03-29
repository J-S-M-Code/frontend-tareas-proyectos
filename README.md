# Frontend - Tasks and Projects

This project is the frontend for the Tasks and Projects management application. It is developed using the latest Angular features (Standalone Components, Signals) and strictly follows the **Spec Driven Development (SDD)** methodology.

## Project Links (Backend)

* **Backend API Repository:** [J-S-M-Code/Integrador-SinTeclados](https://github.com/J-S-M-Code/Integrador-SinTeclados)

## Tech Stack

* **Framework:** Angular 17+ (Standalone Components, Control Flow, Signals)
* **Styles & UI:** Tailwind CSS + PrimeNG *(Modern and comprehensive stack, ideal for enterprise management applications)*
* **Communication:** HttpClient (REST API)
* **Forms:** Reactive Forms
* **Environment:** Node.js v24.14.0

## Prerequisites

To run this project locally, make sure you have the following installed:
* [Node.js](https://nodejs.org/) (Version v24.14.0)
* Angular CLI (`npm install -g @angular/cli`)

## Local Installation & Execution

1.  **Clone the repository:**
    ```bash
    git clone <YOUR_REPOSITORY_URL>
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd frontend-tareas-proyectos
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    ng serve
    ```
    *The application will be available at `http://localhost:4200/`.*

## Methodology: Spec Driven Development (SDD)

This project does not implement any code without a prior specification. Each new feature is first documented in a `SPEC.md` file within its respective branch. 

The workflow is as follows:
1. Create the branch `feature/feature-name`.
2. Write the `SPEC.md` file (Definition of endpoints, business constraints, technical guidelines, and acceptance criteria).
3. Implement the base code validating against the specification.
4. Submit a documented and reviewed Pull Request.