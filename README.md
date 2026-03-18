�� / job-interviews / mini-projects / mini-todo-app 

In-memory TODO app 
In-memory TODO App - recruitment mini-project 
Your task is to create a full-stack web application for simple task management using TODO list. 
Tech stack ¶ 
▸ Backend: Node.js (JavaScript / TypeScript) + Express 
▸ Frontend: React.js (TypeScript) 
Node.js process is running the backend of the app on a server. Frontend app is accessed via a web browser. It makes calls to the REST-style API provided by the backend to retrieve and send data. For simplicity sake, using a database is not required and data can simply be stored in memory directly in the backend. 
Data structure objectives 
▸ Each item has: 
▸ Name 
▸ Completion date 
▸ Due date (empty by default) 
Authentication 
To keep things as simple as possible, there is NO authentication mechanism. 
Functionalities 
User can: 
▸ Create a TODO item. 
▸ Edit a TODO item. 
▸ Delete a TODO item. 
▸ Complete a TODO item. 
▸ Hide/show completed items on the list. They are hidden by default. 
UI mockups
The mockups below show an example of the minimal app UI. 
My great TODO list 
show completed items 
Completed 
Name Due Actions 

Clean the carpet Dust the furniture Clean windows 
18/04/2024 10/04/2024 - 
- - 
- 

- Walk the dog - + add item 
Create / edit list item 
Name: 
Is completed?: 
Due date: 10/05/2024 
Completion date: (not completed) 
Save Cancel 
Implementation remarks 
▸ 
Input data should be validated and an error should be shown to the user when validation fails - eg. user tries to create a TODO item without providing its name. 
▸ 
The API does not have to strictly follow the REST specification. However, please pay attention to HTTP request methods and output codes for success and error responses. Use these codes to properly report successful operations or failed ones resulting in errors (for example validation errors) back to the user in the frontend app. 
▸ 
Even though it is not required to create a proper database, ensure that the code for CRUD operations is kept separate from the core business logic. Your implementation should make it so that the presence or absence of the proper database is not evident when looking solely at the business logic. In other words, business logic should not directly interact with the storage, whatever it might be - database or else, but there should be an abstraction layer in between. 
▸ 
You can build the UI using plain HTML and CSS or take advantage of a UI library, such as 'MUI'. The UI should be intuitive and easy to use. It does not have to be overly pretty or sopthisticated. 
▸ 
You can use any libraries on the backend you deem necessary but remember not to make your application bloated by using large libraries for performing simple tasks. 
▸ In the React app, do not use class-based components but function-based ones that take advantage of React Hooks. ▸ In the React app, try to use useCallback or useMemo hook. 
▸ Please, make sure that your code is well-structured and easy to read 
Solution submission 
Please send this mini-project to us via email or in a shared cloud folder with resources below. 
▸ 
The codebase of the backend application with a main server file named server.js which can be run using: node server.js command. If the backend is written in TypeScript, then provide source files in TS and transpiled files in JS to run with the above-mentioned command. The backend server should bind to localhost address (127.0.0.1) and port 3000 . 
▸ The codebase of the frontend application AND a static built being the contents of build folder after running npm run build . © 2026 Client Engager Online Limited. All rights reserved. | Powered by Wiki.js

