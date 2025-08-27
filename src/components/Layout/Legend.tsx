import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Legend = () => {
  const [isOpen, setIsOpen] = useState(false);

  const legendItems = [
    { letter: 'X', name: 'CLOSE', description: 'Return to main screen' },
    { letter: 'P', name: 'PROFILE', description: 'Contact profile management' },
    { letter: 'H', name: 'HISTORY', description: 'View history' },
    { letter: 'N', name: 'NOTES', description: 'Notes management' },
    { letter: 'M', name: 'MESSAGEZE', description: 'Message center' },
    { letter: 'D', name: 'DOCUMENTS', description: 'Document management' },
    { letter: 'B', name: 'BIZ OPPS', description: 'Business opportunities videos' },
    { letter: 'F', name: 'FOLLOWEZE', description: 'Follow-up management' },
    { letter: 'C', name: 'CALL', description: 'Call contact' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full bg-white border border-gray-300 shadow-sm hover:bg-gray-50 h-10 text-gray-700 font-medium rounded-none"
        >
          LEGEND
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto bg-white">
        <DialogHeader className="bg-gradient-to-r from-[#68C72A] to-[#029100] text-white p-4 -m-6 mb-4">
          <DialogTitle className="text-white font-bold text-lg">LEGEND</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 p-2">
          {legendItems.map((item) => (
            <div key={item.letter} className="flex items-center gap-3">
              <div className="w-6 h-8 bg-gradient-to-r from-[#68C72A] to-[#029100] flex items-center justify-center text-white font-bold text-sm">
                {item.letter}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{item.name}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Legend;