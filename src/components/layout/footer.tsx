import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="border-t border-white/5 bg-black/20 py-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 LinguaForge. MIT License.
          </p>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <span>for translators worldwide</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
