import { createClient, Session, SupabaseClientOptions } from '@supabase/supabase-js';
import { parse, serialize } from 'cookie';
import { parseSupabaseCookie, stringifySupabaseSession } from '@supabase/auth-helpers-shared';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

  class InMemoryStorage implements Storage {
    private data: Record<string, string> = {};
  
    get length(): number {
      return Object.keys(this.data).length;
    }
  
    clear(): void {
      this.data = {};
    }
  
    getItem(key: string): string | null {
      return this.data.hasOwnProperty(key) ? this.data[key] : null;
    }
  
    key(index: number): string | null {
      const keys = Object.keys(this.data);
      return index >= 0 && index < keys.length ? keys[index] : null;
    }
  
    removeItem(key: string): void {
      delete this.data[key];
    }
  
    setItem(key: string, value: string): void {
      this.data[key] = value;
    }
  }

  class PreferenceStorage  {
    async clear(): Promise<void> {
      await Preferences.clear();
    }
  
    async getItem(key: string): Promise<string | null> {
        const { value } = await Preferences.get({ key });
        return value
    }
  
  
    async key(key: string): Promise<string | null> {
          const { value } = await Preferences.get({ key });
          return value
        }
  
    async removeItem(key: string): Promise<void> {
        await Preferences.remove({ key });
    }
  
  
    async setItem(key: string, value: string): Promise<void> {
        await Preferences.set({
            key,
            value,
          });
    }
  }

export function createCapacitorSupabaseClient<
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database
>({
  supabaseUrl,
  supabaseKey,
  options,
  cookieOptions: {
    name = 'supabase-auth-token',
    domain,
    path = '/',
    sameSite = 'lax',
    secure,
    maxAge = 1000 * 60 * 60 * 24 * 365
  } = {}
}: {
  supabaseUrl?: string;
  supabaseKey?: string;
  options?: SupabaseClientOptions<SchemaName>;
  cookieOptions?: any;
}) {

    function isBrowser() {
        return typeof window !== 'undefined';
    }

    const Storage = new PreferenceStorage();
    console.log("used PreferenceStorage")

    // const Storage = new InMemoryStorage();
    // console.log("used memory storage")

    //use device to determine if I should use auth-helper-nextjs or preference storage
    // only ios capacitor uses preference storage
    console.log('Capacitor.getPlatform() = ', Capacitor.getPlatform())
    if (Capacitor.getPlatform() != 'ios') {

        return createBrowserSupabaseClient( {supabaseUrl, supabaseKey, options});
    }

  return createClient<Database, SchemaName>(supabaseUrl, supabaseKey, {
    ...options,
    auth: {
      storageKey: name,
      storage: {
        async getItem(key: string) {
          if (!isBrowser()) {
            console.log('not browser')
            return null;
          }

          const value: string = await Storage.getItem(key);

          const cookies = parse(String(value));
          const session = parseSupabaseCookie(cookies[key]);

          return session ? JSON.stringify(session) : null;
        },
        async setItem(key: string, _value: string) {
          if (!isBrowser()) {

            console.log('not browser')
            return;
          }

          let session: Session = JSON.parse(_value);
          const value = stringifySupabaseSession(session);

          await Storage.setItem(
            key, serialize(key, value, {
              domain,
              path,
              maxAge,
              sameSite,
              secure: secure ?? document.location?.protocol === 'https:'
            })
          );
        },
        async removeItem(key: string) {
          if (!isBrowser()) {

            console.log('not browser')
            return;
          }

          await Storage.removeItem( key );
        }
      }
    }
  });
}
