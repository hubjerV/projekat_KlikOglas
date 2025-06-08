'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useUser } from '@/contexts/UserContext';
import { usePathname } from 'next/navigation';
import { useNewsletterModalContext } from '@/contexts/newsletter-modal.context';
import { media } from '@/utils/media';
import { HamburgerIcon } from './HamburgerIcon';
import Logo from './Logo';
import Button from './Button';
import Container from './Container';


type NavbarProps = {
  items: { title: string; href: string; outlined?: boolean }[];
};

export default function Navbar({ items }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useUser();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
  }, [isMobileMenuOpen]);

  return (
    <NavbarContainer>
      <Content>
        <LogoWrapper>
          <Logo />
        </LogoWrapper>

        <NavItemList>
          {items.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}

          {user ? (
            <>
              <DropdownWrapper ref={dropdownRef}>
                <DropdownItem onClick={() => setDropdownOpen(!isDropdownOpen)}>
                  {user.username}
                </DropdownItem>
                {isDropdownOpen && (
                  <DropdownMenu>
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 text-black">
                      Uredi profil
                    </Link>
                  </DropdownMenu>
                )}
              </DropdownWrapper>

              {/* ✅ Sakrij dugme ako je admin */}
              {!user.isAdmin && (
                <NavItemWrapper>
                  <Link href="/oglasi">Postavi oglas</Link>
                </NavItemWrapper>
              )}

              <NavItemWrapper>
                <LogoutButton
                  onClick={() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem("pregledaniOglasi");
                    setUser(null);
                    router.push('/');
                  }}
                >
                  Logout
                </LogoutButton>
              </NavItemWrapper>
            </>
          ) : (
            <>
              <NavItemWrapper>
                <LoginLink href="/login">Login</LoginLink>
              </NavItemWrapper>
              <NavItemWrapper>
                <SignupButton href="/signup">Sign Up</SignupButton>
              </NavItemWrapper>
            </>
          )}
        </NavItemList>



        <HamburgerMenuWrapper>
          <HamburgerIcon aria-label="Toggle menu" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} />
        </HamburgerMenuWrapper>
        {isMobileMenuOpen && (
          <MobileMenuBackdrop onClick={() => setMobileMenuOpen(false)}>
            <MobileMenu onClick={(e) => e.stopPropagation()}>
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-2 px-4 text-black hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              {user ? (
                <>
                  <Link href="/profile" className="py-2 px-4" onClick={() => setMobileMenuOpen(false)}>
                    Uredi profil
                  </Link>

                  {/* ✅ Sakrij dugme ako je admin */}
                  {!user.isAdmin && (
                    <Link href="/oglasi" className="py-2 px-4" onClick={() => setMobileMenuOpen(false)}>
                      Postavi oglas
                    </Link>
                  )}

                  <button
                    className="py-2 px-4 text-left"
                    onClick={() => {
                      localStorage.removeItem('access_token');
                      setUser(null);
                      setMobileMenuOpen(false);
                      router.push('/');
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="py-2 px-4" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/signup" className="py-2 px-4" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </MobileMenu>
          </MobileMenuBackdrop>
        )}
      </Content>
    </NavbarContainer>
  );
}

function NavItem({ href, title, outlined }: { href: string; title: string; outlined?: boolean }) {
  const { setIsModalOpened } = useNewsletterModalContext();
  if (outlined) {
    return <CustomButton onClick={() => setIsModalOpened(true)}>{title}</CustomButton>;
  }
  return (
    <NavItemWrapper outlined={outlined}>
      <Link href={href}>{title}</Link>
    </NavItemWrapper>
  );
}

const NavbarContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 9999;
  width: 100%;
<<<<<<< HEAD
  background-color: #1a1a1a; 
=======
background-color: #ffffff;
color: #171717;

>>>>>>> origin/izmena-prikaza-oglasa
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;




const Content = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const NavItemList = styled.div`
  display: flex;
  align-items: center;
  ${media('<desktop')} {
    display: none;
  }
`;

const NavItemWrapper = styled.div<{ outlined?: boolean }>`
  margin-right: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;

  a {
color: #171717;

    text-decoration: none;
    padding: 0.75rem 1.5rem;
    display: inline-block;
    font-size: 1.3rem;
    letter-spacing: 0.025em;

    &:hover {
      opacity: 0.7;
    }
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
  margin-right: 1.5rem;
`;

const DropdownItem = styled.span`
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
color: #171717;

  font-size: 1.3rem;
  letter-spacing: 0.025em;

  &:hover {
    opacity: 0.7;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #ffffff;
color: #171717;

  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  z-index: 9999;
  min-width: 150px;
`;

const HamburgerMenuWrapper = styled.div`
  ${media('>=desktop')} {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  margin-right: auto;
`;

const LoginLink = styled(Link)`
color: #171717;

  text-transform: uppercase;
  font-weight: bold;
  text-decoration: none;
  font-size: 1.3rem;
  letter-spacing: 0.025em;
  padding: 0.75rem 1.5rem;
  display: inline-block;
  &:hover {
    opacity: 0.7;
  }
`;

const SignupButton = styled(Link)`
color: #171717;

  text-transform: uppercase;
  font-weight: bold;
  text-decoration: none;
  font-size: 1.3rem;
  letter-spacing: 0.025em;
  padding: 0.75rem 1.5rem;
  display: inline-block;
  &:hover {
    opacity: 0.7;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
color: #171717;

  text-transform: uppercase;
  font-weight: bold;
  font-size: 1.3rem;
  letter-spacing: 0.025em;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

const CustomButton = styled(Button)`
  padding: 0.75rem 1.5rem;
  line-height: 1.8;
`;

const ColorSwitcherContainer = styled.div`
  width: 4rem;
  margin: 0 1rem;
`;

const MobileMenuBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
`;

const MobileMenu = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 75%;
  max-width: 320px;
  height: 100%;
 background-color: #ffffff;
color: #171717;


  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;
