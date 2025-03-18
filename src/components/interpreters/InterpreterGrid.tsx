
import { Interpreter } from '@/types/interpreter';
import InterpreterCard from '@/components/interpreters/InterpreterCard';

interface InterpreterGridProps {
  interpreters: Interpreter[];
}

const InterpreterGrid = ({ interpreters }: InterpreterGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {interpreters.map((interpreter) => (
        <InterpreterCard key={interpreter.id} interpreter={interpreter} />
      ))}
    </div>
  );
};

export default InterpreterGrid;
