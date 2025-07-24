"use client";

import Image from "next/image";
import styles from "./page.module.css";
import React, { useState } from 'react';
import { userSession, authenticate, getUserData, signOut } from '../stacks/wallet';

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);

  React.useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = getUserData();
      setAddress(userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress?.testnet || null);
    }
  }, []);

  const handleConnect = () => {
    authenticate().then(() => {
      const userData = getUserData();
      setAddress(userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress?.testnet || null);
    });
  };

  const handleSignOut = () => {
    signOut();
    setAddress(null);
  };

  return (
    <main style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '2rem',
      background: 'var(--color-dark-grey)',
    }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--color-green)', fontWeight: 800, letterSpacing: '-1px' }}>
        STX Stacking Lottery
      </h1>
      <p style={{ color: 'var(--color-light-grey)', fontSize: '1.2rem', maxWidth: 500, textAlign: 'center' }}>
        Pool your STX with others and get a chance to win the entire stack every PoX cycle. Powered by Stacks smart contracts.
      </p>
      <section style={{
        background: 'var(--color-light-grey)',
        borderRadius: 16,
        padding: '2rem',
        minWidth: 320,
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
      }}>
        {/* Lottery Info Placeholder */}
        <div style={{ color: 'var(--color-dark-blue)', fontWeight: 600, fontSize: '1.1rem' }}>
          <span>Lottery Status: </span>
          <span style={{ color: 'var(--color-green)' }}>Loading...</span>
        </div>
        {/* Connect Wallet Button */}
        {address ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--color-dark-grey)', fontSize: '1rem' }}>Connected: <span style={{ color: 'var(--color-green)' }}>{address.slice(0, 6)}...{address.slice(-4)}</span></span>
            <button onClick={handleSignOut} style={{
              background: 'var(--color-green)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.5rem 1.5rem',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: 8,
            }}>Sign Out</button>
          </div>
        ) : (
          <button onClick={handleConnect} style={{
            background: 'var(--color-green)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.75rem 2rem',
            fontSize: '1.1rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}>
            Connect Wallet
          </button>
        )}
        {/* Join Lottery Form Placeholder */}
        <form style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', alignItems: 'center' }}>
          <input
            type="number"
            min={10}
            placeholder="Amount to stack (STX)"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 6,
              border: '1px solid var(--color-dark-grey)',
              fontSize: '1rem',
              width: '80%',
              background: '#fff',
              color: 'var(--color-dark-grey)',
            }}
            disabled={!address}
          />
          <button type="submit" style={{
            background: 'var(--color-green)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.5rem 1.5rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: address ? 'pointer' : 'not-allowed',
            opacity: address ? 1 : 0.7,
          }} disabled={!address}>
            Join Lottery
          </button>
        </form>
      </section>
      <section style={{ marginTop: 32, width: '100%', maxWidth: 600 }}>
        {/* Participants and Winner Placeholder */}
        <div style={{ color: 'var(--color-light-grey)', fontWeight: 500, fontSize: '1.1rem', marginBottom: 8 }}>
          Participants (current cycle):
        </div>
        <div style={{ background: 'var(--color-light-grey)', borderRadius: 8, padding: 16, minHeight: 48, color: 'var(--color-dark-grey)' }}>
          Loading...
        </div>
        <div style={{ color: 'var(--color-light-grey)', fontWeight: 500, fontSize: '1.1rem', marginTop: 24, marginBottom: 8 }}>
          Last Winner:
        </div>
        <div style={{ background: 'var(--color-light-grey)', borderRadius: 8, padding: 16, minHeight: 48, color: 'var(--color-dark-grey)' }}>
          Loading...
        </div>
      </section>
    </main>
  );
}
