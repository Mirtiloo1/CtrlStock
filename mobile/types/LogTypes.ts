interface LogItemProps {
  type: "IN" | "OUT"; 
  item: string;
  quantity: number;
  timestamp: string;
  key?: number;
}

export { LogItemProps };
