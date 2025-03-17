
import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Language {
  code: string;
  name: string;
  native?: string;
  flag?: string;
}

// Sample language data
const languages: Language[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
];

interface LanguageSelectorProps {
  selectedCode?: string;
  onSelect?: (language: Language) => void;
  label?: string;
  placeholder?: string;
}

const LanguageSelector = ({
  selectedCode = 'en',
  onSelect,
  label = 'Language',
  placeholder = 'Select a language...',
}: LanguageSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Language | undefined>(
    languages.find((lang) => lang.code === selectedCode)
  );
  
  const handleSelect = (language: Language) => {
    setSelected(language);
    setOpen(false);
    if (onSelect) onSelect(language);
  };

  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between bg-background/50 backdrop-blur-sm transition-all duration-200 ease-in-out hover:bg-background/80"
          >
            {selected ? (
              <div className="flex items-center">
                <span className="mr-2">{selected.flag}</span>
                <span>{selected.name}</span>
                {selected.native && selected.native !== selected.name && (
                  <span className="ml-1.5 text-xs text-muted-foreground">({selected.native})</span>
                )}
              </div>
            ) : (
              <div className="flex items-center text-muted-foreground">
                <Globe className="mr-2 h-4 w-4" />
                {placeholder}
              </div>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[250px]">
          <Command>
            <CommandInput placeholder="Search language..." className="h-9" />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {languages.map((language) => (
                  <CommandItem
                    key={language.code}
                    value={`${language.name} ${language.native}`}
                    onSelect={() => handleSelect(language)}
                    className="flex items-center"
                  >
                    <span className="mr-2">{language.flag}</span>
                    <span>{language.name}</span>
                    {language.native && language.native !== language.name && (
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        ({language.native})
                      </span>
                    )}
                    {selected?.code === language.code && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LanguageSelector;
