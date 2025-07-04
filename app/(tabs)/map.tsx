// Exemple d'utilisation dans une page ou un écran
import TrackerMap from '../../components/TrackerMap';

const trackers = [
  { latitude: 48.8584, longitude: 2.2945, name: 'Traceur Tour Eiffel' },
  { latitude: 48.853, longitude: 2.3499, name: 'Traceur Notre-Dame' },
];

export default function MapScreen() {
  return <TrackerMap trackers={trackers} />;
}
