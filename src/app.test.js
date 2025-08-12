import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './apppp';

// Mock fetch
global.fetch = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders e-commerce store title', () => {
    fetch.mockRejectedValueOnce(new Error('API is down'));
    
    render(<App />);
    const titleElement = screen.getByText(/E-Commerce Store/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<App />);
    const loadingElement = screen.getByText(/Loading products/i);
    expect(loadingElement).toBeInTheDocument();
  });

  test('renders products when API call fails (fallback)', async () => {
    fetch.mockRejectedValueOnce(new Error('API is down'));
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Sample Product 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Sample Product 2/i)).toBeInTheDocument();
    });
  });

  test('renders products section', async () => {
    fetch.mockRejectedValueOnce(new Error('API is down'));
    
    render(<App />);
    
    await waitFor(() => {
      const productsHeading = screen.getByText(/Products/i);
      expect(productsHeading).toBeInTheDocument();
    });
  });
});