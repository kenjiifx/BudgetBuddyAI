# Budget Buddy AI 🤖💰

Budget Buddy AI is an intelligent financial advisor chatbot that provides personalized guidance on investing, budgeting, tax planning, retirement planning, and debt management. Built with modern web technologies and natural language processing, it offers an interactive and user-friendly experience for getting financial advice.

## Features ✨

- **Interactive Chat Interface**: Clean, modern UI with dark/light mode support
- **Contextual Conversations**: Maintains conversation context for more relevant responses
- **Multiple Financial Topics**:
  - Investing & Trading
  - Budgeting & Saving 
  - Tax Planning
  - Retirement Planning
  - Debt Management
- **Message Management**: Edit previous messages to explore different financial scenarios
- **Structured Responses**: Clear formatting with key points and follow-up questions
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack 🛠️

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **AI Model**: Hugging Face's Zephyr-7b-beta
- **API Integration**: Hugging Face Inference API

## Getting Started 🚀

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Hugging Face API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/BudgetBuddyAI.git
cd BudgetBuddyAI
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
HF_API_KEY=your_huggingface_api_key_here
```

4. Start the server:
```bash
node app.js
```

5. Open `http://localhost:5000` in your browser

## Usage Guide 💡

### Starting a Conversation
- Launch the application and you'll be greeted with a welcome message
- Choose from one of the five main financial topics:
  1. Investing & Trading
  2. Budgeting & Saving
  3. Tax Planning
  4. Retirement Planning
  5. Debt Management

### Interactive Features
- **Message Editing**: Click the edit icon (✏️) on any of your messages to modify your question and explore different scenarios
- **Copy Function**: Use the copy icon (📋) to save important information
- **Dark/Light Mode**: Toggle between themes using the sun/moon icon in the top right
- **Structured Responses**: Each response includes:
  - Main explanation
  - Key points
  - Follow-up questions

## Project Structure 📁

```
BudgetBuddyAI/
├── backend/
│   ├── routes/
│   │   └── chat.js         # Chat route and AI response handling
│   ├── public/
│   │   ├── css/
│   │   │   └── styles.css  # UI styling
│   │   ├── main.js         # Frontend logic
│   │   └── index.html      # Main application page
│   ├── app.js              # Express server setup
│   └── package.json        # Project dependencies
└── README.md
```

## Key Features Explained 🔍

### Contextual Conversations
- The chatbot maintains conversation history
- Provides relevant follow-up responses based on previous interactions
- Allows editing of past messages to explore different topics

### Financial Topics Coverage
1. **Investing & Trading**
   - Stocks and bonds explanation
   - Investment strategies
   - Risk management

2. **Budgeting & Saving**
   - Personal budget creation
   - Saving strategies
   - Expense tracking

3. **Tax Planning**
   - Tax optimization
   - Deduction strategies
   - Tax-advantaged accounts

4. **Retirement Planning**
   - Retirement accounts
   - Investment strategies
   - Goal setting

5. **Debt Management**
   - Debt reduction strategies
   - Credit score optimization
   - Loan management

## Development 🛠️

### Running in Development Mode
```bash
# Install nodemon for development
npm install -g nodemon

# Run the server with auto-reload
nodemon app.js
```

### Environment Variables
Create a `.env` file in the backend directory with the following:
```env
HF_API_KEY=your_huggingface_api_key_here
PORT=5000 # Optional, defaults to 5000
```

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support 💬

If you have any questions or run into issues, please open an issue in the GitHub repository.

## Author ✍️

Moosa Alam
- GitHub: [@kenjiifx](https://github.com/kenjiifx)
- LinkedIn: [Moosa Alam](https://linkedin.com/in/moosa-alam-470029310/)

## Project Status 🚦
This project is currently in the development phase. It is functional and ready for use, but new features and improvements are being added regularly.
