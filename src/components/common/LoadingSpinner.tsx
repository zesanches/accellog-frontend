export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">
        Carregando checklists...
      </p>
    </div>
  );
}
