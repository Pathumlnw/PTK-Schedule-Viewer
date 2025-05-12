import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface DropdownOption {
  id: number;
  name: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  selected: DropdownOption;
  onChange: (option: DropdownOption) => void;
}

export default function Dropdown({
  label,
  options,
  selected,
  onChange,
}: DropdownProps) {
  return (
    <div className="w-full text-left">
      <Listbox value={selected} onChange={onChange}>
        <div className="relative">
          {label && (
            <Listbox.Label className="block text-sm font-medium text-gray-300 mb-2 text-left">
              {label}
            </Listbox.Label>
          )}
          {/* Control styling - using rgba directly */}
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-[rgba(0,0,0,0.25)] backdrop-blur-sm border border-[rgba(255,255,255,0.25)] py-3 px-4 text-left text-white shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 sm:text-sm">
            {/* Single value styling */}
            <span className="block truncate text-left text-white">
              {selected.name}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* Menu styling */}
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#222] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 text-left ${
                      /* Option styling */
                      active ? "bg-[#444] text-white" : "bg-[#222] text-white"
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate text-left text-white ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
