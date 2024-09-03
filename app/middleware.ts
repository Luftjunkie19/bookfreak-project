import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { useAuthContext } from 'hooks/useAuthContext'
import { usePathname, useRouter } from 'next/navigation';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'; 

// This function can be marked `async` if using `await` inside
export default async function middleware(request: NextRequest) {

    const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() });

    const { data: { session } } = await supabase.auth.getSession();
    
    console.log(session);

    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
    
}
 

export const config = {
    matcher: [
        '/(?!(api|_next/static|_next/image|favicon.ico).*)',
    ],
}
