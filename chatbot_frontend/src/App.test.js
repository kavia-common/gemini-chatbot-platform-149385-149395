import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Send button', () => {
  render(<App />);
  const sendButton = screen.getByRole('button', { name: /send/i });
  expect(sendButton).toBeInTheDocument();
});
