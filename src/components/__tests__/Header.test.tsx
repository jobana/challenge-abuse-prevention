import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Header', () => {
  it('renders with default props', () => {
    render(<Header />);

    const logo = screen.getByRole('img', { name: /volver a Mercado Libre/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/assets/img/logo__small@2x.png');
  });

  it('renders with custom logo', () => {
    render(<Header logoSrc="/custom-logo.png" logoAlt="Custom Logo" />);

    const logo = screen.getByRole('img', { name: /Custom Logo/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/custom-logo.png');
  });

  it('has correct CSS classes', () => {
    const { container } = render(<Header />);

    expect(container.querySelector('.nav-header')).toBeInTheDocument();
    expect(container.querySelector('.nav-container')).toBeInTheDocument();
    expect(container.querySelector('.nav-logo')).toBeInTheDocument();
    expect(container.querySelector('.nav-logo-img')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Header />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders header as semantic element', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });
});
