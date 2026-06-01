namespace BCJS.Configuration;

/// <summary>Padding configuration (top/right/bottom/left).</summary>
public class Padding
{
    /// <summary>Initializes an empty padding.</summary>
    public Padding()
    {
    }

    /// <summary>Initializes uniform padding on all sides.</summary>
    /// <param name="size">The padding applied to every side.</param>
    public Padding(int size)
    {
        Top = size;
        Right = size;
        Bottom = size;
        Left = size;
    }

    /// <summary>Initializes per-side padding.</summary>
    /// <param name="top">Top padding.</param>
    /// <param name="right">Right padding.</param>
    /// <param name="bottom">Bottom padding.</param>
    /// <param name="left">Left padding.</param>
    public Padding(int? top, int? right, int? bottom, int? left)
    {
        Top = top;
        Right = right;
        Bottom = bottom;
        Left = left;
    }

    /// <summary>Top padding.</summary>
    [JsonPropertyName("top")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Top { get; set; }

    /// <summary>Left padding.</summary>
    [JsonPropertyName("left")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Left { get; set; }

    /// <summary>Bottom padding.</summary>
    [JsonPropertyName("bottom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Bottom { get; set; }

    /// <summary>Right padding.</summary>
    [JsonPropertyName("right")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Right { get; set; }
}
