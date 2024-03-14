import { useEffect, useRef } from "react";
import { useGlueTheme } from "./../util/glue";

interface TVWidget {
    options: Record<string, any>;
    subscribeToQuote: (cb: (quote: { short_name: string; description: string; exchange: string; }) => void) => void;
    reload: () => void;
  }

interface TradingViewWidgetProps {
    symbol?: string;
    onSymbolChange: (symbol: {
        symbol: string; 
        description: string; 
        exchange: string;
    }) => void;
}

const TradingViewWidget = ({ symbol, onSymbolChange }: TradingViewWidgetProps) => {

    const chartRef = useRef<{ widget?: TVWidget, lastUserSelection?: string; }>({ lastUserSelection: undefined });
    const theme = useGlueTheme();

    useEffect(() => {
        if (chartRef.current.widget == null) {
          const tvWidget = createTradingWidget({ 
              symbol: symbol ?? '', 
              theme 
            });

          chartRef.current = {
            widget: tvWidget
          };
    
          (window as any).tvWidget = tvWidget;
    
          tvWidget.subscribeToQuote((quote: any) => {
    
            const { short_name, description, exchange } = quote;
    
            if (chartRef.current.lastUserSelection === short_name) {
              chartRef.current.lastUserSelection = short_name;
              return;
            }
    
            chartRef.current.lastUserSelection = short_name;
    
            console.warn('Publish quote -> ', quote);
            onSymbolChange({
              symbol: short_name,
              exchange, 
              description
            });
          });
        }
      }, [symbol, theme, onSymbolChange]);

      useEffect(() => {
        const widget = chartRef.current?.widget;
        if (widget && typeof theme === 'string') {
    
          console.log('[TradingViewWidget] theme changed. Will reload widget...');
    
          try {
            widget.options.theme = theme;
            widget.reload();
          } catch (error) {
            console.error('[TradingViewWidget] failed to reload the widget. Error: ', error);
          }
        }
      }, [theme])

      useEffect(() => {
        const widget = chartRef.current?.widget;
        const symbolChangedOutside = typeof symbol === 'string' && symbol.length > 0 && symbol !== chartRef.current.lastUserSelection;
        if (widget && symbolChangedOutside) {
    
          console.log('[TradingViewWidget] symbol changed. Will reload widget...');
    
          try {
            widget.options.symbol = symbol;
            widget.reload();
          } catch (error) {
            console.error('[TradingViewWidget] failed to reload the widget. Error: ', error);
          }
        }
      }, [symbol]);

    return (
        <div className="tradingview-widget-container d-flex flex-column flex-fill">
            <div id="tradingview-widget" className="d-flex flex-column flex-fill"></div>
            <div className="tradingview-widget-copyright">
                <a
                    href={`https://www.tradingview.com/symbols/NASDAQ-${symbol}/`}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <span className="blue-text">{symbol} Chart</span>
                </a>{" "}
                by TradingView
            </div>
        </div>
    );
};

export default TradingViewWidget;

function createTradingWidget({ symbol, theme }: { symbol: string, theme: string }) {
    return new (window as any).TradingView.widget({
        symbol,
        theme,
        autosize: true,
        interval: "D",
        timezone: "Etc/UTC",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: "tradingview-widget",
    });
}
