import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class HighlightPipe {
    transform(text, search, searchKeyword) {
        let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        pattern = pattern.split(' ').filter((t) => {
            return t.length > 0;
        }).join('|');
        const regex = new RegExp(pattern, 'gi');
        if (!search) {
            return text;
        }
        if (searchKeyword) {
            const name = text[searchKeyword].replace(regex, (match) => `<b>${match}</b>`);
            // copy original object
            const textCopied = { ...text };
            // set bold value into searchKeyword of copied object
            textCopied[searchKeyword] = name;
            return textCopied;
        }
        else {
            return search ? text.replace(regex, (match) => `<b>${match}</b>`) : text;
        }
    }
}
HighlightPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: HighlightPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
HighlightPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: HighlightPipe, name: "highlight" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: HighlightPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'highlight'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0LnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hdXRvY29tcGxldGUtbGliL3NyYy9saWIvaGlnaGxpZ2h0LnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLElBQUksRUFBZ0IsTUFBTSxlQUFlLENBQUM7O0FBS2xELE1BQU0sT0FBTyxhQUFhO0lBQ3hCLFNBQVMsQ0FBQyxJQUFTLEVBQUUsTUFBVyxFQUFFLGFBQW1CO1FBQ25ELElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMscUNBQXFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUUsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDYixNQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFeEMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxJQUFJLGFBQWEsRUFBRTtZQUNqQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDO1lBQzlFLHVCQUF1QjtZQUN2QixNQUFNLFVBQVUsR0FBRyxFQUFDLEdBQUcsSUFBSSxFQUFDLENBQUM7WUFDN0IscURBQXFEO1lBQ3JELFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDakMsT0FBTyxVQUFVLENBQUM7U0FDbkI7YUFBTTtZQUNMLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7U0FDMUU7SUFDSCxDQUFDOzswR0F0QlUsYUFBYTt3R0FBYixhQUFhOzJGQUFiLGFBQWE7a0JBSHpCLElBQUk7bUJBQUM7b0JBQ0osSUFBSSxFQUFFLFdBQVc7aUJBQ2xCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQaXBlLCBQaXBlVHJhbnNmb3JtfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQFBpcGUoe1xuICBuYW1lOiAnaGlnaGxpZ2h0J1xufSlcbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIHRyYW5zZm9ybSh0ZXh0OiBhbnksIHNlYXJjaDogYW55LCBzZWFyY2hLZXl3b3JkPzogYW55KTogYW55IHtcbiAgICBsZXQgcGF0dGVybiA9IHNlYXJjaC5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgJ1xcXFwkJicpO1xuICAgIHBhdHRlcm4gPSBwYXR0ZXJuLnNwbGl0KCcgJykuZmlsdGVyKCh0KSA9PiB7XG4gICAgICByZXR1cm4gdC5sZW5ndGggPiAwO1xuICAgIH0pLmpvaW4oJ3wnKTtcbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAocGF0dGVybiwgJ2dpJyk7XG5cbiAgICBpZiAoIXNlYXJjaCkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgaWYgKHNlYXJjaEtleXdvcmQpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSB0ZXh0W3NlYXJjaEtleXdvcmRdLnJlcGxhY2UocmVnZXgsIChtYXRjaCkgPT4gYDxiPiR7bWF0Y2h9PC9iPmApO1xuICAgICAgLy8gY29weSBvcmlnaW5hbCBvYmplY3RcbiAgICAgIGNvbnN0IHRleHRDb3BpZWQgPSB7Li4udGV4dH07XG4gICAgICAvLyBzZXQgYm9sZCB2YWx1ZSBpbnRvIHNlYXJjaEtleXdvcmQgb2YgY29waWVkIG9iamVjdFxuICAgICAgdGV4dENvcGllZFtzZWFyY2hLZXl3b3JkXSA9IG5hbWU7XG4gICAgICByZXR1cm4gdGV4dENvcGllZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNlYXJjaCA/IHRleHQucmVwbGFjZShyZWdleCwgKG1hdGNoKSA9PiBgPGI+JHttYXRjaH08L2I+YCkgOiB0ZXh0O1xuICAgIH1cbiAgfVxufVxuIl19