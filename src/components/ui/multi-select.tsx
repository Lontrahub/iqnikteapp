'use client';

import * as React from 'react';
import { X } from 'phosphor-react';

import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';

type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  creatable?: boolean;
  onNewItemCreate?: (value: string) => void;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select...',
  creatable = false,
  onNewItemCreate,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const handleUnselect = (value: string) => {
    onChange(selected.filter((s) => s !== value));
  };

  const handleSelect = (value: string) => {
    if (!selected.includes(value)) {
      onChange([...selected, value]);
    }
    setInputValue('');
  };

  const selectedObjects = selected
    .map((s) => options.find((opt) => opt.value === s) || (creatable ? { value: s, label: s } : null))
    .filter(Boolean) as Option[];
  
  const filteredOptions = options.filter(opt => !selected.includes(opt.value));
  const showCreateOption = creatable && inputValue && !options.some(opt => opt.label.toLowerCase() === inputValue.toLowerCase());


  return (
    <Command onKeyDown={(e) => {
        if (e.key === 'Escape') {
            inputRef.current?.blur();
        }
    }} className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selectedObjects.map(({ value, label }) => (
            <Badge key={value} variant="secondary">
              {label}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUnselect(value);
                }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleUnselect(value)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && (filteredOptions.length > 0 || showCreateOption) ? (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandGroup>
                {showCreateOption && (
                    <CommandItem
                        key={inputValue}
                        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onSelect={() => {
                            if (onNewItemCreate) {
                                onNewItemCreate(inputValue);
                            } else {
                                handleSelect(inputValue);
                            }
                            setInputValue('');
                        }}
                        className="cursor-pointer"
                    >
                        {`Create "${inputValue}"`}
                    </CommandItem>
                )}
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
