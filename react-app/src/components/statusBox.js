/**
 * v0 by Vercel.
 * @see https://v0.dev/t/DdLO2tvFxSL
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function StatusBox() {
    return (
      <div className="flex flex-col items-center w-full min-h-screen p-4 bg-gray-100">

        <div className="w-full max-w-4xl mt-4 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between p-4 bg-gray-200 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="w-16 h-16 bg-gray-300 rounded-lg" />
              <div>
                <h3 className="text-lg font-bold">Status</h3>
                <p>LV: 10</p>
              </div>
            </div>
            <button className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400">Inventory</button>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4">
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Strength: 75</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Dexterity: 60</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Intelligence: 50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Luck: 75</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Defense: 60</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Speed: 50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Concentration: 75</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Reaction: 60</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">HP Regeneration: 50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">MP Regeneration: 75</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <div className="w-full h-4 bg-gray-300 rounded-lg">
                  <div className="w-3/4 h-full bg-yellow-500 rounded-lg" />
                </div>
                <span className="text-sm">EXP: 75/100</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full h-4 bg-gray-300 rounded-lg">
                  <div className="w-2/3 h-full bg-red-500 rounded-lg" />
                </div>
                <span className="text-sm">HP: 60/100</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full h-4 bg-gray-300 rounded-lg">
                  <div className="w-1/2 h-full bg-blue-500 rounded-lg" />
                </div>
                <span className="text-sm">MP: 50/100</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-xs mt-4 bg-white rounded-lg shadow-md">
          <div className="p-4 bg-gray-200 rounded-t-lg">
            <h3 className="text-lg font-bold">Inventory</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 p-4">
            <div className="flex flex-col items-center">
              <span>Helmet</span>
              <div className="w-12 h-12 bg-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col items-center">
              <span>Armor</span>
              <div className="w-12 h-12 bg-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col items-center">
              <span>Gloves</span>
              <div className="w-12 h-12 bg-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col items-center">
              <span>Pants</span>
              <div className="w-12 h-12 bg-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col items-center">
              <span>Right Hand</span>
              <div className="w-12 h-12 bg-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col items-center">
              <span>Left Hand</span>
              <div className="w-12 h-12 bg-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col items-center">
              <span>Shoes</span>
              <div className="w-12 h-12 bg-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col items-center">
              <span>Ring 1</span>
              <div className="w-12 h-12 bg-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col items-center">
              <span>Ring 2</span>
              <div className="w-12 h-12 bg-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col items-center">
              <span>Earring 1</span>
              <div className="w-12 h-12 bg-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col items-center">
              <span>Earring 2</span>
              <div className="w-12 h-12 bg-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col items-center">
              <span>Necklace</span>
              <div className="w-12 h-12 bg-gray-300 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 p-4">
            {Array.from({ length: 16 }).map((_, index) => (
              <div key={index} className="w-12 h-12 bg-gray-300 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }