interface User {
  id: number;
  name: string;
  subscription_id: number | null;
}

interface UpdateSubscription {
  subscription_id: number;
}
