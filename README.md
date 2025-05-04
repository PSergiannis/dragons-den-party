# Dragons Den Party App

A party-themed web application for voting on cocktails and dragons, built with Next.js, Tailwind CSS, and PostgreSQL.

## Features

- Guest voting system for cocktails and dragons
- Real-time statistics display
- Mobile-responsive design
- Menu display
- Secure voting with one vote per user

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Nginx server (for production deployment)

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd dragons-den-party
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/dragons_den_party"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

4. Initialize the database:

```bash
npx prisma db push
```

5. Add the menu image:

- Place `DragonsDenMenu.png` in the `public` directory

## Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Production Deployment

1. Build the application:

```bash
npm run build
```

2. Configure Nginx:

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Start the production server:

```bash
npm start
```

## Database Schema

The application uses the following database tables:

- `users`: Stores user information
- `cocktails`: Stores cocktail options
- `dragons`: Stores dragon options
- `votes`: Stores user votes with points

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
