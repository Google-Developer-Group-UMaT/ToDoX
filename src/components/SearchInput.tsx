
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchInput = ({ searchQuery, onSearchChange }: SearchInputProps) => {
  return (
    <div className="relative px-6 mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 border-todo-border focus-visible:ring-todo-highlight"
        />
      </div>
    </div>
  );
};

export default SearchInput;
