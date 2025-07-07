export default function Footer() {
  return (
    <footer className="bg-background/80 border-t mt-auto">
      <div className="container mx-auto py-6 px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Mayan Medicine Guide. All rights reserved.</p>
        <p className="mt-1">A tribute to the preservation of traditional knowledge.</p>
      </div>
    </footer>
  );
}
