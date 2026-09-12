import { Link } from 'react-router-dom';
import { Map } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-6 py-20">
      <div className="relative">
        <Map className="w-24 h-24 text-slate-600 opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-slate-400">
          ?
        </div>
      </div>
      
      <h1 className="fantasy-heading text-4xl font-bold">Uncharted Territory</h1>
      
      <p className="text-slate-400 max-w-md text-lg">
        The region you're looking for does not exist on the current map of the realm. Perhaps the path was lost to time.
      </p>
      
      <Link to="/" className="glass-button mt-4 px-6 flex items-center gap-2">
        <Map className="w-4 h-4" />
        Return to the Realm
      </Link>
    </div>
  );
}
