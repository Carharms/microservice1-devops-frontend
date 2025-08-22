// Simple functionality unit test feature
import { render, screen } from '@testing-library/react';
import MainApp from './MainApp';

test('renders store title', () => {
  render(<MainApp />);
  expect(screen.getByText(/E-Commerce Store/i)).toBeInTheDocument();
});
