import { CalendarRange, Info, AlertTriangle, Calendar } from 'lucide-react';

interface LeaseDurationPickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  durationMonths: number;
  durationDays: number;
  isValid: boolean;
}

export default function LeaseDurationPicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  durationMonths,
  durationDays,
  isValid
}: LeaseDurationPickerProps) {

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-6 border border-outline-variant transition-all duration-300"
      id="lease-duration-picker-container"
    >
      {/* Block Title */}
      <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
        <CalendarRange className="w-5 h-5 text-primary" />
        <span>Select Lease Duration</span>
      </h3>

      {/* Date Pickers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Rental Start Date */}
        <div className="flex flex-col gap-2">
          <label
            className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5"
            htmlFor="start-date"
          >
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Rental Start Date</span>
          </label>
          <div className="relative">
            <input
              className="w-full h-12 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all px-4 text-on-surface font-medium bg-surface-container-lowest focus:outline-none"
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>
        </div>

        {/* Rental End Date */}
        <div className="flex flex-col gap-2">
          <label
            className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5"
            htmlFor="end-date"
          >
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Rental End Date</span>
          </label>
          <div className="relative">
            <input
              className="w-full h-12 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all px-4 text-on-surface font-medium bg-surface-container-lowest focus:outline-none"
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
        </div>

      </div>

      {/* Dynamic Alert Banner depending on Validation Status */}
      {isValid ? (
        <div className="mt-6 p-4 bg-surface-container rounded-lg flex items-start gap-3 border border-primary/10 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
            Currently selected: <strong className="text-primary">{durationDays} day{durationDays !== 1 ? 's' : ''}</strong> ({durationMonths} month{durationMonths !== 1 ? 's' : ''}). Dates are subject to final landlord approval during the verification process.
          </p>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-error-container text-on-error-container rounded-lg flex items-start gap-3 border border-error/20 animate-wiggle duration-300">
          <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm">
            <p className="font-bold mb-0.5">
              {durationDays === 0 ? 'Please Select an End Date' : 'Invalid Lease Duration'}
            </p>

            <p className="leading-relaxed text-on-error-container/90">
              {durationDays === 0
                ? 'Please select an end date that is at least 30 days after the start date.'
                : `Minimum lease duration is 30 days. Your selection is only ${durationDays} day${durationDays !== 1 ? 's' : ''}. Please adjust the end date accordingly.`
              }
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
