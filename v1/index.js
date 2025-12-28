import React, { useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

function useFilteredBots(bots, query, tagFilter, sortBy) {
  return useMemo(() => {
    let out = bots.filter((b) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.short.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    });
    if (tagFilter && tagFilter !== "All") {
      out = out.filter((b) => b.tags.includes(tagFilter));
    }

    if (sortBy === "featured") out = out.sort((a, z) => Number(z.featured) - Number(a.featured));
    if (sortBy === "popular") out = out.sort((a, z) => z.guilds - a.guilds);

    return out;
  }, [bots, query, tagFilter, sortBy]);
}

function BotsShowcase() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [selected, setSelected] = useState(null);

  const allTags = useMemo(() => {
    const set = new Set(sampleBots.flatMap((b) => b.tags));
    return ["All", ...Array.from(set)];
  }, []);

  const filtered = useFilteredBots(sampleBots, query, tag, sortBy);

  function copyInvite(invite) {
    if (navigator.clipboard) navigator.clipboard.writeText(invite);
    else alert("Invite copied: " + invite);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-8">
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Your Discord Bots</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">Clean, modern showcase for all your bots.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-700/60 border rounded-lg px-3 py-2 shadow-sm">
              <Search className="w-4 h-4 text-slate-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bots, features, commands..."
                className="border-0 bg-transparent p-0 focus:ring-0"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="rounded-lg border px-3 py-2 bg-white/80 dark:bg-slate-700/60"
              >
                {allTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border px-3 py-2 bg-white/80 dark:bg-slate-700/60"
              >
                <option value="featured">Featured</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((bot) => (
            <motion.div
              key={bot.id}
              whileHover={{ translateY: -6 }}
              className="rounded-2xl"
            >
              <Card className="overflow-hidden">
                <div className="flex gap-4 p-4 items-center">
                  <img src={bot.logo} alt={`${bot.name} logo`} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{bot.name}</CardTitle>
                      {bot.featured && <Badge className="ml-1">Featured</Badge>}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{bot.short}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-slate-500">Prefix: <strong>{bot.prefix}</strong></span>
                      <span className="text-xs text-slate-500">• {bot.guilds.toLocaleString()} servers</span>
                    </div>

                    <div className="mt-3 flex gap-2 flex-wrap">
                      {bot.tags.map((t) => (
                        <Badge key={t} className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <CardFooter className="p-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelected(bot);
                      }}
                    >
                      Details
                    </Button>

                    <Button
                      onClick={() => {
                        copyInvite(bot.invite);
                      }}
                    >
                      Copy Invite
                    </Button>
                  </div>

                  <a href={bot.invite} target="_blank" rel="noreferrer">
                    <Button>Invite</Button>
                  </a>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </section>

        {filtered.length === 0 && (
          <div className="mt-12 text-center text-slate-500">No bots matched your search. Try different keywords or filters.</div>
        )}

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-2xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <img src={selected.logo} className="w-20 h-20 rounded-lg object-cover" />
                  <div>
                    <h2 className="text-2xl font-bold">{selected.name}</h2>
                    <p className="text-sm text-slate-500">{selected.short}</p>
                    <div className="mt-2 flex gap-2">
                      {selected.tags.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-slate-700 dark:text-slate-200">
                  <p>{selected.description}</p>

                  <div className="mt-4">
                    <h3 className="font-semibold">Quick commands</h3>
                    <pre className="bg-slate-100 dark:bg-slate-900 rounded-md p-3 mt-2 text-sm">{`${selected.prefix}help\n${selected.prefix}settings\n${selected.prefix}invite`}</pre>
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between border-t dark:border-slate-700">
                <div className="text-sm text-slate-500">{selected.guilds.toLocaleString()} servers</div>
                <div className="flex gap-2">
                  <Button onClick={() => copyInvite(selected.invite)}>Copy Invite</Button>
                  <a href={selected.invite} target="_blank" rel="noreferrer">
                    <Button>Open Invite</Button>
                  </a>
                  <Button variant="ghost" onClick={() => setSelected(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto mt-12 text-center text-sm text-slate-500">Built with ❤️ — customize this layout to match your brand.</footer>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<BotsShowcase />);
